import { Token } from '../lexer';
import { ASTNode } from '../ast';

/**
 * Very small parser stub that turns token stream into a rudimentary AST-like structure.
 * Replace with a proper grammar-based parser (Nearley/PEG.js) later.
 */
export function parse(tokens: Token[]): ASTNode {
  return {
    type: 'Program',
    body: tokens.map((t) => ({ type: 'TokenNode', token: t })),
  } as ASTNode;
}
