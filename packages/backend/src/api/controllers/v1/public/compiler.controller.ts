import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import { compile, validate, analyzeCode } from '@/services/compiler.service';

export const compilerController = {
  compile: catchAsync(async (req: Request, res: Response) => {
    const { source } = req.body;
    if (typeof source !== 'string') {
      return res.status(400).json({ error: 'Missing required field: source (string)' });
    }

    const move = await compile(source);
    res.json({ move });
  }),

  /**
   * Validate MoveJS source code (syntax only)
   */
  validate: catchAsync(async (req: Request, res: Response) => {
    const { source } = req.body;
    if (typeof source !== 'string') {
      return res.status(400).json({ error: 'Missing required field: source (string)' });
    }

    const result = await validate(source);
    res.json(result);
  }),

  /**
   * Analyze MoveJS source code (semantic analysis)
   */
  analyze: catchAsync(async (req: Request, res: Response) => {
    const { source } = req.body;
    if (typeof source !== 'string') {
      return res.status(400).json({ error: 'Missing required field: source (string)' });
    }

    const result = await analyzeCode(source);
    res.json(result);
  }),
};
