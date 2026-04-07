import express from 'express';
import { 
  createBooking, 
  trackBooking, 
  getBookings, 
  getBookingsByStatus, 
  updateBookingStatus, 
  uploadReport,
  deleteBooking
} from '../controllers/bookingController';
import { protectAdmin } from '../middleware/authMiddleware';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = express.Router();

// Guest routes
router.post('/', createBooking);
router.get('/track', trackBooking);

// Admin routes
router.get('/', protectAdmin, getBookings);
router.get('/status/:status', protectAdmin, getBookingsByStatus);
router.patch('/:id/status', protectAdmin, updateBookingStatus);
router.post('/:id/upload', protectAdmin, uploadMiddleware.single('report'), uploadReport);
router.delete('/:id', protectAdmin, deleteBooking);

export default router;
