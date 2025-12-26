import winston from 'winston';
import { format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), loggerFormat),
  transports: [
    new transports.Console({ format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), loggerFormat) }),
    new transports.File({ filename: path.join(logsDir, 'combined.log') }),
    new transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
  ],
});

export function taggedLogger(tag: string) {
  const prefix = `[${tag}]`;
  return {
    info: (msg: string) => logger.info(`${prefix} ${msg}`),
    warn: (msg: string) => logger.warn(`${prefix} ${msg}`),
    error: (msg: string) => logger.error(`${prefix} ${msg}`),
    debug: (msg: string) => logger.debug(`${prefix} ${msg}`),
  };
}

// Request logging middleware exported from the logging config
export function requestLogger(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    logger.info(`${req.method} ${req.originalUrl} ${status} ${ms}ms`);
  });
  next();
}

export default logger;