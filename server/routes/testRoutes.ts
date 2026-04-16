import express from 'express';
import { getTests, addTest, updateTest, deleteTest } from '../controllers/testController';
import { verifyToken, isOwner } from '../middleware/authMiddleware';

const router = express.Router();

// ─── Public Routes (no auth required) ─────────────────────────────────────
// GET /api/tests — public catalog of available tests
router.get('/', getTests);

// ─── Owner-Only Routes (verifyToken + isOwner) ─────────────────────────────
// POST   /api/tests      — add a new test
router.post('/', verifyToken, isOwner, addTest);

// PATCH  /api/tests/:id  — update test details / pricing
router.patch('/:id', verifyToken, isOwner, updateTest);

// DELETE /api/tests/:id  — remove a test from the catalog
router.delete('/:id', verifyToken, isOwner, deleteTest);

export default router;
