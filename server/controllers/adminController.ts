import { Request, Response } from 'express';
import { AdminModel } from '../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const OWNER_USERNAME = process.env.OWNER_USERNAME || 'owner';
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'owner123';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * initAdmin — Seeds a single predefined owner account on startup.
 * Removes any stale non-owner accounts to enforce single-owner policy.
 */
export const initAdmin = async (): Promise<void> => {
  // Remove any accounts that are not the designated owner
  await AdminModel.deleteMany({ username: { $ne: OWNER_USERNAME } });

  const ownerExists = await AdminModel.findOne({ username: OWNER_USERNAME });
  if (!ownerExists) {
    const hashedPassword = await bcrypt.hash(OWNER_PASSWORD, 12);
    await AdminModel.create({
      username: OWNER_USERNAME,
      password: hashedPassword,
      role: 'owner',
    });
    console.log(`✅ Seeded owner account (username: "${OWNER_USERNAME}")`);
  } else {
    console.log(`✅ Owner account verified (username: "${OWNER_USERNAME}")`);
  }
};

/**
 * loginAdmin — Authenticates the owner via username + bcrypt password check.
 * Issues a signed JWT stored in a secure httpOnly cookie.
 * @route POST /api/login
 */
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' });
    return;
  }

  const admin = await AdminModel.findOne({ username });
  if (!admin || !admin.password) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }

  // Enforce owner-only login
  if (admin.role !== 'owner') {
    res.status(403).json({ message: 'Access denied. Owner account required.' });
    return;
  }

  const token = jwt.sign(
    { id: admin._id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',       // ← allows cross-origin cookies (Vercel → Render)
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  // Also return the token in the body so cross-origin clients (Vercel)
  // can store it in localStorage and send it as Authorization header.
  res.json({ id: admin._id, username: admin.username, role: admin.role, token });
};

/**
 * getAuthUser — Returns the currently authenticated owner's profile.
 * @route GET /api/auth/user
 */
export const getAuthUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const token =
      req.cookies?.access_token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const admin = await AdminModel.findById(decoded.id).select('-password');

    if (!admin) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    res.json({ id: admin._id, username: admin.username, role: admin.role });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * logoutAdmin — Clears the auth cookie and redirects to home.
 * @route GET /api/logout
 */
export const logoutAdmin = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('access_token', { path: '/' });
  res.redirect('/');
};
