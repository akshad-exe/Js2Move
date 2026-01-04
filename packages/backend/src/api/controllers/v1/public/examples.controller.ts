import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import { ExamplesService } from '@/services/examples.service';

const examplesService = new ExamplesService();

export const examplesController = {
  /**
   * Get all available examples
   */
  getExamples: catchAsync(async (req: Request, res: Response) => {
    const { difficulty, includeSource } = req.query;
    const include = includeSource === 'true' 

    let examples;
    if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty as string)) {
      examples = examplesService.getExamplesByDifficulty(difficulty as 'beginner' | 'intermediate' | 'advanced', include);
    } else {
      examples = examplesService.getExamples(include);
    }

    res.json({ examples });
  }),

  /**
   * Get a specific example by ID
   */
  getExample: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing example ID' });
    }

    const example = examplesService.getExample(id);
    if (!example) {
      return res.status(404).json({ error: 'Example not found' });
    }

    res.json(example);
  }),
};