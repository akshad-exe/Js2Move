/**
 * Generator Test Suite
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../dist/lexer/lexer.js';
import { parse } from '../dist/parser/parser.js';
import { generate } from '../dist/generator/generator.js';

test('Generator: should generate valid Move module', () => {
  const source = 'contract Test { resource R { v: u64 }; }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = generate(ast);
  
  assert(result.code.includes('module Test'));
  assert(result.code.includes('struct R'));
  assert(result.code.includes('v: u64'));
});

test('Generator: should generate functions', () => {
  const source = 'contract Test { resource R { v: u64 }; test(x: u64): u64 { return x; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = generate(ast);
  
  assert(result.code.includes('fun test'));
  assert(result.code.includes('x: u64'));
  assert(result.code.includes('return'));
});

test('Generator: should use Handlebars template', () => {
  const source = 'contract Token { resource Balance { amount: u64 }; }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = generate(ast);
  
  // Check template structure
  assert(result.code.includes('module Token'));
  assert(result.code.includes('use std::signer'));
  assert(result.code.includes('struct Balance has key, store'));
});

test('Generator: should format code with options', () => {
  const source = 'contract Test { resource R { v: u64 }; }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = generate(ast, { format: 'pretty', indentSize: 4 });
  
  assert(result.code.includes('module Test'));
  // Pretty formatting should produce multiple lines
  assert(result.code.split('\n').length > 3);
});

test('Generator: should handle resource abilities', () => {
  const source = 'contract Test { resource Balance { value: u64 }; }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const result = generate(ast);
  
  assert(result.code.includes('has key, store'));
});
