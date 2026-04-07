import express from 'express';
import { loginAdmin, getAuthUser, logoutAdmin, registerAdmin } from '../controllers/adminController';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/auth/user', getAuthUser);
router.get('/logout', logoutAdmin);

export default router;
