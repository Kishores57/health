import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

export const protectAdmin = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.access_token || null;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;

    if (decoded.role !== 'admin' && decoded.role !== 'owner') {
      return res.status(403).json({ message: 'Not authorized, admin only' });
    }

    req.admin = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
