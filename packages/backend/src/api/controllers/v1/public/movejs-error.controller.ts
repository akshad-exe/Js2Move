/**
 * MoveJS Error Analyzer Controller
 */

import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import {
  analyzeMoveJSError,
  validateMoveJSStructure,
  generateErrorReport,
  autoFixMoveJSCode
} from '@/services/movejs-error-analyzer.service';

export const moveJSErrorController = {
  /**
   * Analyze a MoveJS compilation error
   * POST /api/v1/movejs/analyze-error
   */
  analyzeError: catchAsync(async (req: Request, res: Response) => {
    const { error, code } = req.body;
    
    if (!error || !code) {
      return res.status(400).json({
        error: 'Missing required fields: error, code'
      });
    }
    
    const analysis = analyzeMoveJSError(error, code);
    res.json({ success: true, analysis });
  }),

  /**
   * Validate MoveJS code structure
   * POST /api/v1/movejs/validate
   */
  validate: catchAsync(async (req: Request, res: Response) => {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        error: 'Missing required field: code'
      });
    }
    
    const validation = validateMoveJSStructure(code);
    res.json({ success: true, validation });
  }),

  /**
   * Get detailed error report with recommendations
   * POST /api/v1/movejs/error-report
   */
  errorReport: catchAsync(async (req: Request, res: Response) => {
    const { error, code } = req.body;
    
    if (!error || !code) {
      return res.status(400).json({
        error: 'Missing required fields: error, code'
      });
    }
    
    const report = generateErrorReport(error, code);
    res.json({ success: true, report });
  }),

  /**
   * Auto-fix MoveJS code issues
   * POST /api/v1/movejs/auto-fix
   */
  autoFix: catchAsync(async (req: Request, res: Response) => {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        error: 'Missing required field: code'
      });
    }
    
    const result = autoFixMoveJSCode(code);
    res.json({ success: true, ...result });
  })
};
