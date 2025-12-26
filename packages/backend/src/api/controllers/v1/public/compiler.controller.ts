import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import { compile } from '@/services/compiler.service';

export const compilerController = {
  compile: catchAsync(async (req: Request, res: Response) => {
    const { source } = req.body;
    if (typeof source !== 'string') {
      return res.status(400).json({ error: 'Missing required field: source (string)' });
    }

    const move = await compile(source);
    res.json({ move });
  }),
};
