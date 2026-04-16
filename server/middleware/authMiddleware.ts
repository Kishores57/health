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

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

/**
 * verifyToken — Validates the JWT from the `access_token` cookie or Authorization header.
 * Attaches decoded payload to `req.admin`.
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  let token = req.cookies?.access_token || null;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.admin = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * isOwner — Ensures the authenticated user has the 'owner' role.
 * Must be used AFTER verifyToken.
 */
export const isOwner = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.admin || req.admin.role !== 'owner') {
    res.status(403).json({ message: 'Forbidden: Owner access required' });
    return;
  }
  next();
};

// Backwards-compatible alias (used in existing route files before refactor)
export const protectAdmin = verifyToken;
