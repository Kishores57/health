import { Request, Response } from 'express';
import { BookingModel } from '../models/Booking';
import { TestModel } from '../models/Test';
import { generateBookingId } from '../utils/bookingHelper';
import { sendBookingConfirmation, sendReportNotification } from '../mailer';

// @desc    Create a guest booking
// @route   POST /api/bookings
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientName, age, phone, email, address, testIds, bookingDate, timeSlot } = req.body;

    if (!testIds || testIds.length === 0) {
      res.status(400).json({ message: 'At least one test must be selected' });
      return;
    }

    const test = await TestModel.findOne({ id: testIds[0] });
    if (!test) {
      res.status(404).json({ message: 'Test not found' });
      return;
    }

    // Slot availability logic: Max 5 bookings per slot as a basic limit
    const existingBookings = await BookingModel.countDocuments({ bookingDate, timeSlot });
    if (existingBookings >= 5) {
      res.status(400).json({ message: 'Time slot is fully booked' });
      return;
    }

    let isUnique = false;
    let newBookingId = '';
    while (!isUnique) {
      newBookingId = generateBookingId();
      const existing = await BookingModel.findOne({ bookingId: newBookingId });
      if (!existing) isUnique = true;
    }

    // Determine numerical ID since auto-increment was previously used or required by zod
    const lastBooking = await BookingModel.findOne().sort('-id');
    const nextId = lastBooking && lastBooking.id ? lastBooking.id + 1 : 1;

    const booking = await BookingModel.create({
      id: nextId,
      bookingId: newBookingId,
      patientName,
      age,
      phone,
      email,
      address,
      testIds,
      bookingDate,
      timeSlot,
      status: 'pending'
    });

    const testName = test.name || "Medical Test";
    // Await the Gmail OAuth 2.0 Email Confirmation to catch configuration errors
    if (email) {
      await sendBookingConfirmation(email, booking, test);
    }

    res.status(201).json(booking);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Track booking
// @route   GET /api/bookings/track
export const trackBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, bookingId } = req.query;
    
    if (!phoneNumber || !bookingId) {
      res.status(400).json({ message: 'Please provide phoneNumber and bookingId' });
      return;
    }

    const booking = await BookingModel.findOne({ 
      phone: phoneNumber.toString(), 
      bookingId: bookingId.toString() 
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Fetch associated tests manually since we use Number array instead of ObjectRefs
    const tests = await TestModel.find({ id: { $in: booking.testIds } });
    
    res.json({ ...booking.toJSON(), tests });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Admin
export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await BookingModel.find({}).sort({ createdAt: -1 });
    // This is simple version, full populate would require manual fetching of numeric IDs
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get bookings by status
// @route   GET /api/bookings/status/:status
// @access  Admin
export const getBookingsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;
    const bookings = await BookingModel.find({ status }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Admin
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const booking = await BookingModel.findOneAndUpdate({ id: Number(id) }, { status }, { new: true });
    
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Try to get test name
    let testName = "Medical Test";
    if (booking.testIds && booking.testIds.length > 0) {
      const test = await TestModel.findOne({ id: booking.testIds[0] });
      if (test) testName = test.name;
    }


    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Upload Report
// @route   POST /api/bookings/:id/upload
// @access  Admin
export const uploadReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Using the numeric id
    
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a PDF file' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    const booking = await BookingModel.findOneAndUpdate(
      { id: Number(id) }, 
      { reportUrl: fileUrl, status: 'completed' }, 
      { new: true }
    );

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Try to get test name
    let testName = "Medical Test";
    if (booking.testIds && booking.testIds.length > 0) {
      const test = await TestModel.findOne({ id: booking.testIds[0] });
      if (test) testName = test.name;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    // Asynchronously trigger the Gmail OAuth 2.0 Report Delivery Email
    if (booking.email) {
      sendReportNotification(booking.email, `${frontendUrl}${fileUrl}`, req.file.path, testName).catch(console.error);
    }

    res.json({ message: 'Report uploaded successfully', booking });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a completed booking
// @route   DELETE /api/bookings/:id
// @access  Admin
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Explicitly scope delete operation to tests that are completed
    const booking = await BookingModel.findOneAndDelete({ id: Number(id), status: 'completed' });
    
    if (!booking) {
      res.status(404).json({ message: 'Completed booking not found or could not be verified for deletion.' });
      return;
    }

    res.json({ message: 'Booking successfully deleted.', deletedId: booking.id });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
