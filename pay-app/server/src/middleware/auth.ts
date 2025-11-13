import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or not valid' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId?: string };
    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Invalid/Expired token' });
    }
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid/Expired token' });
  }
}