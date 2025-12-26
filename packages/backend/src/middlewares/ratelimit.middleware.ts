import { Request, Response, NextFunction } from 'express';
import { APIError } from '@/utils/APIError';

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60;
const store = new Map<string, { count: number; windowStart: number }>();

export function rateLimitMiddleware(req: Request, _res: Response, next: NextFunction) {
  const key = (req.ip || req.headers['x-forwarded-for'] || 'unknown') as string;
  const now = Date.now();
  const entry = store.get(key) || { count: 0, windowStart: now };
  if (now - entry.windowStart > WINDOW_MS) {
    entry.count = 1;
    entry.windowStart = now;
  } else {
    entry.count += 1;
  }
  store.set(key, entry);
  if (entry.count > MAX_REQUESTS) {
    return next(new APIError('Too many requests', 429));
  }
  next();
}
