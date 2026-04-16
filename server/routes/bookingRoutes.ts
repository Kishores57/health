import express from 'express';
import {
  createBooking,
  trackBooking,
  getBookings,
  getBookingsByStatus,
  updateBookingStatus,
  uploadReport,
  deleteBooking,
} from '../controllers/bookingController';
import { verifyToken, isOwner } from '../middleware/authMiddleware';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = express.Router();

// ─── Public Routes (no auth required) ─────────────────────────────────────
// POST /api/bookings      — guest creates a booking
router.post('/', createBooking);

// GET  /api/bookings/track — guest tracks booking by phone + bookingId
router.get('/track', trackBooking);

// ─── Owner-Only Routes (verifyToken + isOwner) ─────────────────────────────
// GET  /api/bookings             — list all bookings
router.get('/', verifyToken, isOwner, getBookings);

// GET  /api/bookings/status/:status — filter bookings by status
router.get('/status/:status', verifyToken, isOwner, getBookingsByStatus);

// PATCH /api/bookings/:id/status  — update booking status
router.patch('/:id/status', verifyToken, isOwner, updateBookingStatus);

// POST /api/bookings/:id/upload   — upload report PDF
router.post('/:id/upload', verifyToken, isOwner, uploadMiddleware.single('report'), uploadReport);

// DELETE /api/bookings/:id        — delete a completed booking
router.delete('/:id', verifyToken, isOwner, deleteBooking);

export default router;
