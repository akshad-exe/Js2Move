/**
 * Semantic Analyzer Test Suite
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../dist/lexer/lexer.js';
import { parse } from '../dist/parser/parser.js';
import { analyze } from '../dist/semantic/index.js';

test('Semantic: should accept valid code', () => {
  const source = 'contract Test { resource R { v: u64 }; add(a: u64, b: u64): u64 { return a + b; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = analyze(ast);
  
  assert.strictEqual(result.errors.length, 0);
});

test('Semantic: should detect type mismatches', () => {
  const source = 'contract Test { resource R { v: u64 }; bad(x: bool, y: u64): u64 { return x + y; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = analyze(ast);
  
  assert(result.errors.length > 0);
  assert(result.errors.some(e => e.message.includes('Arithmetic operation requires numeric types')));
});

test('Semantic: should detect undefined identifiers', () => {
  const source = 'contract Test { resource R { v: u64 }; test(): u64 { return unknownVar; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = analyze(ast);
  
  assert(result.errors.length > 0);
  assert(result.errors.some(e => e.message.includes('Undefined identifier')));
});

test('Semantic: should detect duplicate parameters', () => {
  const source = 'contract Test { resource R { v: u64 }; test(x: u64, x: u64) {} }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = analyze(ast);
  
  assert(result.errors.length > 0);
  assert(result.errors.some(e => e.message.includes('Duplicate parameter')));
});

test('Semantic: should validate function calls', () => {
  const source = 'contract Test { resource R { v: u64 }; foo(x: u64) {} bar() { foo(); } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = analyze(ast);
  
  assert(result.errors.length > 0);
  assert(result.errors.some(e => e.message.includes('expects 1 arguments')));
});
