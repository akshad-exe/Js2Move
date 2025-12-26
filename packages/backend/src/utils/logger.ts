import { Request, Response, NextFunction } from 'express';
import logger from '@/config/logger';

export default function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    logger.info(`${req.method} ${req.originalUrl} ${status} ${ms}ms`);
  });
  next();
}

export const log = {
  info: (...args: any[]) => logger.info(args.map(String).join(' ')),
  warn: (...args: any[]) => logger.warn(args.map(String).join(' ')),
  error: (...args: any[]) => logger.error(args.map(String).join(' ')),
};
