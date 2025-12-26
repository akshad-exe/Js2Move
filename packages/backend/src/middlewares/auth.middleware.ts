import { Request, Response, NextFunction } from 'express';
import { APIError } from '@/utils/APIError';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return next(new APIError('Unauthorized', 401));
  }
  next();
}
