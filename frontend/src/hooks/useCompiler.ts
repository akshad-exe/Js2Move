import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { validateCode, analyzeCode } from '@/lib/api/compilerClient';
import { compileMoveJS } from '@/lib/compiler/compilerBridge';
import type { ValidationResponse, AnalysisResponse } from '@/lib/types';

export function useCompiler() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const compile = useCallback(async (source: string) => {
    if (!source.trim()) {
      toast.error('Code is empty!');
      return null;
    }

    setIsCompiling(true);
    setError('');

    try {
      const result = await compileMoveJS(source);
      if (result.success) {
        setOutput(result.output);
        return result;
      } else {
        const errorMsg = result.logs.join('\n');
        setError(errorMsg);
        return result;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Compilation failed';
      setError(errorMsg);
      return { success: false, output: '', logs: [errorMsg] };
    } finally {
      setIsCompiling(false);
    }
  }, []);

  const validate = useCallback(async (source: string): Promise<ValidationResponse | null> => {
    setIsValidating(true);
    try {
      const result = await validateCode(source);
      return result;
    } catch (err) {
      console.error('Validation hook error:', err);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const analyze = useCallback(async (source: string): Promise<AnalysisResponse | null> => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCode(source);
      return result;
    } catch (err) {
      console.error('Analysis hook error:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    compile,
    validate,
    analyze,
    isCompiling,
    isValidating,
    isAnalyzing,
    output,
    error,
    setOutput,
    setError
  };
}
