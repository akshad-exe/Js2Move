import { Request, Response, NextFunction } from 'express';
import { APIError } from '@/utils/APIError';

export function errorConverter(err: any, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof APIError) return next(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const convertedError = new APIError(message, statusCode, false, err.stack);
  return next(convertedError);
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const response: any = {
    code: status,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  console.error(err?.stack || err);
  res.status(status).json(response);
}
