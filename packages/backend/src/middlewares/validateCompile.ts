import { Request, Response, NextFunction } from 'express';
import { APIError } from '@/utils/APIError';

export default function validateCompile(req: Request, _res: Response, next: NextFunction) {
  const { source } = req.body;
  if (typeof source !== 'string') {
    throw new APIError('Missing required field: source (string)', 400);
  }
  next();
}
