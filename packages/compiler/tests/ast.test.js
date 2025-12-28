/**
 * AST Test Suite
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../dist/lexer/lexer.js';
import { parse } from '../dist/parser/parser.js';
import { BaseASTVisitor, printAST } from '../dist/ast/index.js';

test('AST: visitor should traverse all nodes', () => {
  const source = 'contract Test { resource R { v: u64 }; test() { return 1; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  
  class Counter extends BaseASTVisitor {
    constructor() {
      super();
      this.count = 0;
    }
    visitContract() { this.count++; return super.visitContract(...arguments); }
    visitResourceDeclaration() { this.count++; return super.visitResourceDeclaration(...arguments); }
    visitFunctionDeclaration() { this.count++; return super.visitFunctionDeclaration(...arguments); }
  }
  
  const counter = new Counter();
  counter.visit(ast);
  
  assert.strictEqual(counter.count, 3); // 1 contract + 1 resource + 1 function
});

test('AST: printer should reconstruct source', () => {
  const source = 'contract Test { resource R { v: u64 }; }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  
  const printed = printAST(ast);
  
  assert(printed.includes('contract Test'));
  assert(printed.includes('resource R'));
  assert(printed.includes('v: u64'));
});

test('AST: visitor should allow custom transformations', () => {
  const source = 'contract Test { test() { return x; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  
  class IdentifierCollector extends BaseASTVisitor {
    constructor() {
      super();
      this.identifiers = [];
    }
    visitIdentifier(node) {
      this.identifiers.push(node.name);
    }
  }
  
  const collector = new IdentifierCollector();
  collector.visit(ast);
  
  assert(collector.identifiers.includes('Test'));
  assert(collector.identifiers.includes('test'));
  assert(collector.identifiers.includes('x'));
});
