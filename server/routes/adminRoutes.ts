import express from 'express';
import { loginAdmin, getAuthUser, logoutAdmin } from '../controllers/adminController';
import { verifyToken, isOwner } from '../middleware/authMiddleware';

const router = express.Router();

// ─── Public Auth Routes ────────────────────────────────────────────────────
// POST /api/login  — owner login (issues JWT cookie)
router.post('/login', loginAdmin);

// GET  /api/auth/user — return current authenticated owner profile
router.get('/auth/user', getAuthUser);

// GET  /api/logout — clear auth cookie and redirect to home
router.get('/logout', logoutAdmin);

// ─── Protected Admin Routes (verifyToken + isOwner) ────────────────────────
// These routes are guarded — only a valid owner JWT can access them.

// GET /api/admin/dashboard — owner dashboard data endpoint
router.get('/admin/dashboard', verifyToken, isOwner, (req, res) => {
  res.json({ message: 'Welcome to the owner dashboard', admin: req.admin });
});

// GET /api/admin/bookings — see bookingRoutes for full CRUD
// GET /api/admin/tests    — see testRoutes for full CRUD
// (the above are handled in their respective route files with verifyToken + isOwner)

export default router;
