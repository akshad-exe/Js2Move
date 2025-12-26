import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';

export const exampleController = {
  getHello: catchAsync(async (_req: Request, res: Response) => {
    res.json({ message: 'hello' });
  }),
};
