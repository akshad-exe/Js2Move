import { useState, useCallback, useEffect } from 'react';
import { getExamples, getExample } from '@/lib/api/examplesClient';
import { CodeExample } from '@/lib/types';

export function useExamples(category?: string, difficulty?: string) {
  const [examples, setExamples] = useState<CodeExample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExamples = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExamples(category, difficulty);
      setExamples(data);
    } catch (err) {
      setError('Failed to fetch examples');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty]);

  useEffect(() => {
    fetchExamples();
  }, [fetchExamples]);

  const getDetails = useCallback(async (id: string) => {
    return await getExample(id);
  }, []);

  return {
    examples,
    loading,
    error,
    fetchExamples,
    getDetails
  };
}
