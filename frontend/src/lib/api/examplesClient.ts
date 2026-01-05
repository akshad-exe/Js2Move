import { apiClient } from './axiosClient';
import type {
  CodeExample 
} from '../types';

/**
 * Get all code examples with optional filtering
 */
export async function getExamples(
  difficulty?: string
): Promise<CodeExample[]> {
  try {
    const params = new URLSearchParams();
    if (difficulty) params.append('difficulty', difficulty.toLowerCase());
    params.append('includeSource', 'true');

    const queryString = params.toString();
    const endpoint = queryString ? `/public/examples?${queryString}` : '/public/examples?includeSource=true';
    
    const response = await apiClient.get<{ examples: CodeExample[] }>(endpoint);
    return response.data.examples || [];
  } catch (error) {
    console.error('Failed to fetch examples:', error);
    return [];
  }
}

/**
 * Get specific example by ID (includes source code)
 */
export async function getExample(id: string): Promise<CodeExample | null> {
  try {
    const response = await apiClient.get<CodeExample>(`/public/example/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch example:', error);
    return null;
  }
}

/**
 * Get examples by difficulty level
 */
export async function getExamplesByDifficulty(difficulty: string): Promise<CodeExample[]> {
  return getExamples(difficulty);
}

/**
 * Search examples by keyword
 */
export function searchExamples(examples: CodeExample[], keyword: string): CodeExample[] {
  const lower = keyword.toLowerCase();
  return examples.filter(
    (ex) =>
      (ex.name?.toLowerCase().includes(lower) ?? false) ||
      (ex.description?.toLowerCase().includes(lower) ?? false) ||
      (ex.tags?.some((tag) => tag?.toLowerCase().includes(lower)) ?? false)
  );
}

/**
 * Group examples by difficulty
 */
export function groupByDifficulty(examples: CodeExample[]): Record<string, CodeExample[]> {
  return examples.reduce(
    (acc, example) => {
      const difficulty = (example.difficulty || 'intermediate').charAt(0).toUpperCase() + (example.difficulty || 'intermediate').slice(1);
      if (!acc[difficulty]) {
        acc[difficulty] = [];
      }
      acc[difficulty].push(example);
      return acc;
    },
    {} as Record<string, CodeExample[]>
  );
}
