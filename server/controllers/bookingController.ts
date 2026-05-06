import { Request, Response } from 'express';
import { BookingModel } from '../models/Booking';
import { TestModel } from '../models/Test';
import { generateBookingId } from '../utils/bookingHelper';
import { sendBookingConfirmation, sendReportNotification } from '../mailer';
import { markSlotBooked, makeSlotKey } from '../services/slotService';

// ── Perf helper ───────────────────────────────────────────────────────────────
const perfLog = (label: string, startMs: number) => {
  if (process.env.NODE_ENV !== 'production') return;
  const ms = Date.now() - startMs;
  if (ms > 500) console.warn(`⚠️  SLOW [${label}]: ${ms}ms`);
  else console.log(`⚡ [${label}]: ${ms}ms`);
};

// ── Create Booking ─────────────────────────────────────────────────────────────
// @route POST /api/bookings  (public)
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const t0 = Date.now();
  try {
    const { patientName, age, phone, email, address, testIds, bookingDate, timeSlot, homeCollection } = req.body;

    if (!testIds || testIds.length === 0) {
      res.status(400).json({ message: 'At least one test must be selected' });
      return;
    }

    // ── Step 1: Run slot check + test lookup + max-id fetch in PARALLEL ──────
    const [slotCount, test, lastBooking] = await Promise.all([
      BookingModel.countDocuments({ bookingDate, timeSlot }),                // uses { bookingDate, timeSlot } index
      TestModel.findOne({ id: testIds[0] }, 'name price fastingRequired'),   // projection — only needed fields
      BookingModel.findOne({}, 'id').sort({ id: -1 }).lean(),                // uses id index, lean() = 30% faster
    ]);
    perfLog('createBooking:prefetch', t0);

    if (!test) {
      res.status(404).json({ message: 'Test not found' });
      return;
    }

    if (slotCount >= 5) {
      res.status(400).json({ message: 'Time slot is fully booked. Please choose another slot.' });
      return;
    }

    // ── Step 2: Generate a unique booking ID (single attempt with fallback) ──
    // Use crypto-random suffix to minimise collision probability, skip loop
    const newBookingId = generateBookingId();
    const nextId       = (lastBooking?.id ?? 0) + 1;

    // ── Step 3: Create the booking ───────────────────────────────────────────
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
      homeCollection,
      status: 'pending',
    });
    perfLog('createBooking:insert', t0);

    // ── Step 4: Broadcast slot as booked via WebSocket ───────────────────────
    const slotKey = makeSlotKey(bookingDate, timeSlot, testIds);
    markSlotBooked(slotKey);

    // ── Step 5: Fire-and-forget confirmation email ───────────────────────────
    // Do NOT await — email sending must never block the booking response
    if (email) {
      sendBookingConfirmation(email, booking, test).catch((err) =>
        console.error('Email send failed (non-fatal):', err.message)
      );
    }

    perfLog('createBooking:total', t0);
    res.status(201).json(booking);
  } catch (err: any) {
    // Duplicate bookingId (rare race condition) — retry once
    if (err.code === 11000 && err.keyPattern?.bookingId) {
      try {
        const fallbackId = generateBookingId();
        const lastBooking = await BookingModel.findOne({}, 'id').sort({ id: -1 }).lean();
        const nextId = (lastBooking?.id ?? 0) + 1;
        const { patientName, age, phone, email, address, testIds, bookingDate, timeSlot, homeCollection } = req.body;
        const booking = await BookingModel.create({
          id: nextId, bookingId: fallbackId,
          patientName, age, phone, email, address, testIds, bookingDate, timeSlot, homeCollection, status: 'pending',
        });
        res.status(201).json(booking);
      } catch (retryErr: any) {
        res.status(500).json({ message: 'Booking ID conflict. Please try again.' });
      }
      return;
    }
    console.error('createBooking error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ── Get Single Booking ───────────────────────────────────────────────────────
// @route GET /api/bookings/:id  (public)
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Booking ID is required' });
      return;
    }

    // Find by numeric ID or string bookingId (e.g. BKG-XXXX)
    const booking = await BookingModel.findOne({
      $or: [
        { id: isNaN(Number(id)) ? -1 : Number(id) },
        { bookingId: id }
      ]
    }).lean();

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Parallel: fetch tests, include report field for frontend compatibility
    const tests = await TestModel.find(
      { id: { $in: booking.testIds } },
      'id name price sampleType turnaroundTime category'
    ).lean();

    // The frontend Reports.tsx expects booking.report if it exists
    // The model has reportUrl, but System B used a separate Report model. 
    // In our current System A, reportUrl is on the Booking itself.
    // We'll map it to the structure the frontend expects.
    const enrichedBooking = {
      ...booking,
      tests,
      report: booking.reportUrl ? { reportUrl: booking.reportUrl, uploadedAt: (booking as any).updatedAt } : null
    };

    res.json(enrichedBooking);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Track Booking ──────────────────────────────────────────────────────────────
// @route GET /api/bookings/track  (public)
export const trackBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, bookingId } = req.query;

    if (!phoneNumber || !bookingId) {
      res.status(400).json({ message: 'Please provide phoneNumber and bookingId' });
      return;
    }

    // Uses { phone, bookingId } compound index
    const booking = await BookingModel.findOne({
      phone: phoneNumber.toString(),
      bookingId: bookingId.toString(),
    }).lean();

    if (!booking) {
      res.status(404).json({ message: 'Booking not found. Check your booking ID and phone number.' });
      return;
    }

    // Parallel: fetch tests alongside the response build
    const tests = await TestModel.find(
      { id: { $in: booking.testIds } },
      'id name price sampleType turnaroundTime category'
    ).lean();

    res.json({ ...booking, tests });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get All Bookings (owner) ───────────────────────────────────────────────────
// @route GET /api/bookings
export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    // lean() skips Mongoose document hydration — 30–50% faster for list reads
    const bookings = await BookingModel.find({}).sort({ createdAt: -1 }).lean();

    // Collect all unique testIds, fetch once instead of N queries
    const allTestIds = Array.from(new Set(bookings.flatMap((b) => b.testIds)));
    const tests = await TestModel.find({ id: { $in: allTestIds } }, 'id name price sampleType').lean();
    const testMap = new Map(tests.map((t) => [t.id, t]));

    const enriched = bookings.map((b) => ({
      ...b,
      tests: b.testIds.map((tid: number) => testMap.get(tid)).filter(Boolean),
    }));

    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get Bookings by Status (owner) ────────────────────────────────────────────
// @route GET /api/bookings/status/:status
export const getBookingsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;
    // Uses { status, createdAt } index
    const bookings = await BookingModel.find({ status }).sort({ createdAt: -1 }).lean();
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update Booking Status (owner) ─────────────────────────────────────────────
// @route PATCH /api/bookings/:id/status
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    // Uses { id } index; lean() not used here because we return the full document
    const booking = await BookingModel.findOneAndUpdate(
      { id: Number(id) },
      { status },
      { new: true }
    );

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Upload Report (owner) ─────────────────────────────────────────────────────
// @route POST /api/bookings/:id/upload
export const uploadReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({ message: 'Please upload a PDF file' });
      return;
    }

    // With Cloudinary, req.file.path contains the direct URL to the uploaded file
    const fileUrl = req.file.path;

    const booking = await BookingModel.findOneAndUpdate(
      { id: Number(id) },
      { reportUrl: fileUrl, status: 'completed' },
      { new: true }
    );

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Non-blocking: look up test name + send email in background
    if (booking.email) {
      TestModel.findOne({ id: booking.testIds[0] }, 'name')
        .lean()
        .then((test) => {
          const testName = test?.name || 'Medical Test';
          return sendReportNotification(
            booking.email,
            fileUrl, // Direct Cloudinary URL
            undefined, // Cloudinary URLs handle downloads, no need to attach local file path
            testName
          );
        })
        .catch((err) => console.error('Report email failed (non-fatal):', err.message));
    }

    res.json({ message: 'Report uploaded successfully', booking });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ── Delete Booking (owner, completed only) ────────────────────────────────────
// @route DELETE /api/bookings/:id
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await BookingModel.findOneAndDelete({
      id: Number(id),
      status: 'completed',
    });

    if (!booking) {
      res.status(404).json({ message: 'Completed booking not found or already deleted.' });
      return;
    }

    res.json({ message: 'Booking deleted successfully.', deletedId: booking.id });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
