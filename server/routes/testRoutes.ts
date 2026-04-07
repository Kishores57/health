import express from 'express';
import { getTests, addTest, updateTest, deleteTest } from '../controllers/testController';
import { protectAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public route to get tests
router.get('/', getTests);

// Admin routes
router.post('/', protectAdmin, addTest);
router.patch('/:id', protectAdmin, updateTest);
router.delete('/:id', protectAdmin, deleteTest);

export default router;
