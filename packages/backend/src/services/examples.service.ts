import fs from 'fs';
import path from 'path';
import { CodeExample } from '@/types';

// Path to examples directory (assuming it's in the compiler package)
const examplesDir = path.resolve(process.cwd(), '../compiler/examples');

type Example = CodeExample;

export class ExamplesService {
  private examples: Example[] = [];

  constructor() {
    // Load from DB if available; otherwise fall back to filesystem
    this.loadFromDb().catch(() => this.loadExamples());
  }

  private async loadFromDb(): Promise<void> {
    try {
      const { getPrisma } = await import('@/config/database');
      const prisma = getPrisma();
      const rows = await prisma.example.findMany({ orderBy: { id: 'asc' } });
      if (!rows || rows.length === 0) throw new Error('No examples in DB');

      this.examples = rows.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || undefined,
        difficulty: (r.difficulty as Example['difficulty']) || 'intermediate',
        source: r.source,
      }));

      return;
    } catch (error) {
      // Propagate error to allow fallback to filesystem loader
      throw error;
    }
  }

  /**
   * Force reload examples from database. Returns true when loaded from DB.
   */
  async refreshFromDb(): Promise<boolean> {
    try {
      await this.loadFromDb();
      return true;
    } catch (err) {
      return false;
    }
  }

  private loadExamples() {
    try {
      const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.movejs'));

      this.examples = files.map(filename => {
        const baseName = filename.replace('.movejs', '');
        const parts = baseName.split('-');
        const id = parts[0]; // numeric prefix like '01'
        const filePath = path.join(examplesDir, filename);
        const source = fs.readFileSync(filePath, 'utf-8');

        // If filename has a trailing descriptive part (e.g., '01-hello-world'), build a readable name
        const nameFromFile = parts.length > 1
          ? parts.slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase())
          : undefined;

        // Extract metadata from numeric id
        const descriptions: Record<string, { name: string; description: string; difficulty: Example['difficulty'] }> = {
          '01': {
            name: 'Hello World',
            description: 'Simplest possible contract showing basic structure and syntax',
            difficulty: 'beginner'
          },
          '02': {
            name: 'Simple Token',
            description: 'Basic token with balance tracking, transfer functions, and access control',
            difficulty: 'beginner'
          },
          '03': {
            name: 'NFT Contract',
            description: 'Non-fungible token pattern with minting and transfer capabilities',
            difficulty: 'intermediate'
          },
          '04': {
            name: 'DeFi Vault',
            description: 'Advanced DeFi pattern with deposits, withdrawals, and yield farming',
            difficulty: 'advanced'
          }
        };

        const metadata = descriptions[id] || {
          name: nameFromFile ?? id,
          description: nameFromFile ? `Example contract: ${nameFromFile}` : `Example contract: ${id}`,
          difficulty: 'intermediate' as const
        };

        return {
          id,
          ...metadata,
          source
        };
      });
    } catch (error) {
      console.warn('Failed to load examples:', error);
      this.examples = [];
    }
  }

  /**
   * Get all available examples
   * @param includeSource include source code in the returned examples
   */
  getExamples(includeSource = false): (Omit<Example, 'source'>[] | Example[]) {
    if (includeSource) return this.examples;
    return this.examples.map(({ source, ...example }) => example);
  }

  /**
   * Get a specific example by ID
   */
  getExample(id: string): Example | null {
    return this.examples.find(example => example.id === id) || null;
  }

  /**
   * Get examples by difficulty level
   */
  getExamplesByDifficulty(difficulty: Example['difficulty'], includeSource = false): (Omit<Example, 'source'>[] | Example[]) {
    const filtered = this.examples.filter(example => example.difficulty === difficulty);
    if (includeSource) return filtered;
    return filtered.map(({ source, ...example }) => example);
  }
}