import { apiClient } from './axiosClient';

export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  code: string;
  tags: string[];
  github?: string;
  docs?: string;
}

export interface TemplatesResponse {
  templates: Template[];
}

/**
 * Get all templates
 */
export async function getTemplates(
  category?: string,
  difficulty?: string
): Promise<Template[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);

    const queryString = params.toString();
    const endpoint = queryString ? `/public/templates?${queryString}` : '/public/templates';
    
    const response = await apiClient.get<TemplatesResponse>(endpoint);
    return response.data.templates || [];
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    // Fallback to local templates
    return getLocalTemplates();
  }
}

/**
 * Get specific template by ID
 */
export async function getTemplate(id: string): Promise<Template | null> {
  try {
    const response = await apiClient.get<Template>(`/public/template/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch template:', error);
    return null;
  }
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(category: string): Promise<Template[]> {
  return getTemplates(category);
}

/**
 * Get templates by difficulty level
 */
export async function getTemplatesByDifficulty(difficulty: string): Promise<Template[]> {
  return getTemplates(undefined, difficulty);
}

/**
 * Search templates by keyword
 */
export function searchTemplates(templates: Template[], keyword: string): Template[] {
  const lower = keyword.toLowerCase();
  return templates.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lower))
  );
}

/**
 * Group templates by category
 */
export function groupByCategory(templates: Template[]): Record<string, Template[]> {
  return templates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    },
    {} as Record<string, Template[]>
  );
}

/**
 * Local fallback templates (used when API is unavailable)
 */
function getLocalTemplates(): Template[] {
  return [
    {
      id: 'token-template',
      title: 'Global Storage Pattern',
      category: 'Architecture',
      description: 'Define a persistent storage resource for global state management',
      difficulty: 'Beginner',
      icon: 'Layers',
      code: `// Define a persistent storage resource
contract Vault {
  resource Data;

  init(signer: address, val: u64) {
    Data[signer] = val;
  }
}`,
      tags: ['storage', 'pattern', 'architecture'],
    },
    {
      id: 'access-control-template',
      title: 'Access Control Layer',
      category: 'Security',
      description: 'Secure capability pattern for role-based access',
      difficulty: 'Intermediate',
      icon: 'Shield',
      code: `// Secure capability pattern
contract AdminOnly {
  resource AdminCap;

  only_admin(signer: signer) {
    assert(has_resource<AdminCap>(signer), 401);
  }
}`,
      tags: ['security', 'access-control', 'capability'],
    },
    {
      id: 'token-logic-template',
      title: 'Fungible Token Logic',
      category: 'DeFi',
      description: 'Basic coin transfer and balance management',
      difficulty: 'Intermediate',
      icon: 'Coins',
      code: `// Basic coin logic
contract Token {
  resource Balance;

  transfer(from: signer, to: address, amount: u64) {
    Balance[from] -= amount;
    Balance[to] += amount;
  }
}`,
      tags: ['token', 'defi', 'transfer'],
    },
    {
      id: 'event-template',
      title: 'Event Emission',
      category: 'Communication',
      description: 'Notify listeners of state changes with events',
      difficulty: 'Beginner',
      icon: 'Sparkles',
      code: `// Notify listeners of state changes
contract Bridge {
  emit_transfer(from: address, to: address, val: u64) {
    emit TransferEvent { from, to, val };
  }
}`,
      tags: ['events', 'communication', 'state'],
    },
  ];
}
