import { Request, Response, NextFunction } from 'express';

export default function validateCompile(req: Request, res: Response, next: NextFunction) {
  const { source } = req.body;
  if (typeof source !== 'string') {
    return res.status(400).json({ error: 'Missing required field: source (string)' });
  }
  next();
}
