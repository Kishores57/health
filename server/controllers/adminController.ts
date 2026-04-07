import { Request, Response } from 'express';
import { AdminModel } from '../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const initAdmin = async () => {
  const adminExists = await AdminModel.findOne({ username: 'admin' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await AdminModel.create({ username: 'admin', password: hashedPassword, role: 'admin' });
    console.log('Seeded default admin user (admin / admin123)');
  }
};

export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' });
    return;
  }

  const existing = await AdminModel.findOne({ username });
  if (existing) {
    res.status(400).json({ message: 'Username already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await AdminModel.create({
    username,
    password: hashedPassword,
    role: username.toLowerCase() === 'owner' ? 'owner' : 'admin'
  });

  const token = jwt.sign(
    { id: newAdmin._id, username: newAdmin.username, role: newAdmin.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );

  res.cookie('access_token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });
  res.status(201).json({ id: newAdmin._id, username: newAdmin.username, role: newAdmin.role, token });
};

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' });
    return;
  }
  const admin = await AdminModel.findOne({ username });
  if (admin && admin.password && (await bcrypt.compare(password, admin.password))) {
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );
    // Set cookie for frontend
    res.cookie('access_token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });
    res.json({ id: admin._id, username: admin.username, role: admin.role, token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

export const getAuthUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.access_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) { 
        res.status(401).json({ message: 'Not authorized' }); 
        return; 
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const admin = await AdminModel.findById(decoded.id).select('-password');
    if (!admin) { 
        res.status(401).json({ message: 'User not found' }); 
        return; 
    }
    
    // Check if the frontend expects owner role
    const role = admin.username === 'owner' ? 'owner' : admin.role;
    res.json({ id: admin._id, username: admin.username, role });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const logoutAdmin = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('access_token', { path: '/' });
  res.redirect('/');
};
