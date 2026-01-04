import { apiClient } from './axiosClient';
import { 
  CodeExample, 
  ExamplesResponse 
} from '../types';

/**
 * Get all code examples
 */
export async function getExamples(
  category?: string,
  difficulty?: string
): Promise<CodeExample[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);

    const queryString = params.toString();
    const endpoint = queryString ? `/examples?${queryString}` : '/examples';
    
    const response = await apiClient.get<ExamplesResponse>(endpoint);
    return response.data.examples || [];
  } catch (error) {
    console.error('Failed to fetch examples:', error);
    return [];
  }
}

/**
 * Get specific example by ID
 */
export async function getExample(id: string): Promise<CodeExample | null> {
  try {
    const response = await apiClient.get<CodeExample>(`/example/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch example:', error);
    return null;
  }
}

/**
 * Get examples by category
 */
export async function getExamplesByCategory(category: string): Promise<CodeExample[]> {
  return getExamples(category);
}

/**
 * Get examples by difficulty level
 */
export async function getExamplesByDifficulty(difficulty: string): Promise<CodeExample[]> {
  return getExamples(undefined, difficulty);
}

/**
 * Search examples by keyword
 */
export function searchExamples(examples: CodeExample[], keyword: string): CodeExample[] {
  const lower = keyword.toLowerCase();
  return examples.filter(
    (ex) =>
      ex.title.toLowerCase().includes(lower) ||
      ex.description.toLowerCase().includes(lower) ||
      ex.tags.some((tag) => tag.toLowerCase().includes(lower))
  );
}

/**
 * Group examples by category
 */
export function groupByCategory(examples: CodeExample[]): Record<string, CodeExample[]> {
  return examples.reduce(
    (acc, example) => {
      if (!acc[example.category]) {
        acc[example.category] = [];
      }
      acc[example.category].push(example);
      return acc;
    },
    {} as Record<string, CodeExample[]>
  );
}
