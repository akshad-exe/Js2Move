import { ASTNode } from '../ast';

export type SemanticResult = { errors: string[] };

export function analyze(ast: ASTNode): SemanticResult {
  // Minimal stub: no errors yet. Add ownership and resource checks here.
  return { errors: [] };
}
