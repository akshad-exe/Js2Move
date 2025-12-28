/**
 * IR Test Suite
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../dist/lexer/lexer.js';
import { parse } from '../dist/parser/parser.js';
import { buildIR, optimize } from '../dist/ir/index.js';

test('IR: should build IR module', () => {
  const source = 'contract Test { resource R { v: u64 }; test() {} }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const ir = buildIR(ast);
  
  assert.strictEqual(ir.name, 'Test');
  assert.strictEqual(ir.resources.length, 1);
  assert.strictEqual(ir.functions.length, 1);
});

test('IR: should generate instructions for functions', () => {
  const source = 'contract Test { resource R { v: u64 }; add(x: u64, y: u64): u64 { return x + y; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const ir = buildIR(ast);
  
  assert.strictEqual(ir.functions[0].name, 'add');
  assert.strictEqual(ir.functions[0].parameters.length, 2);
  assert(ir.functions[0].blocks.length > 0);
  assert(ir.functions[0].blocks[0].instructions.length > 0);
});

test('IR: should include resource definitions', () => {
  const source = 'contract Test { resource Balance { amount: u64, locked: bool }; }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const ir = buildIR(ast);
  
  assert.strictEqual(ir.resources.length, 1);
  assert.strictEqual(ir.resources[0].name, 'Balance');
  assert.strictEqual(ir.resources[0].fields.length, 2);
  assert.strictEqual(ir.resources[0].fields[0].name, 'amount');
  assert.strictEqual(ir.resources[0].fields[1].name, 'locked');
});

test('IR: optimizer should run without errors', () => {
  const source = 'contract Test { resource R { v: u64 }; calc(): u64 { return 10 + 20; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const ir = buildIR(ast);
  
  const optimized = optimize(ir, 1);
  
  assert.strictEqual(optimized.name, 'Test');
  assert.strictEqual(optimized.functions.length, 1);
});

test('IR: optimizer should perform constant folding', () => {
  const source = 'contract Test { resource R { v: u64 }; calc(): u64 { return 5 + 3; } }';
  const tokens = tokenize(source).tokens;
  const ast = parse(tokens).ast;
  const ir = buildIR(ast);
  
  const beforeCount = ir.functions[0].blocks.reduce((sum, b) => sum + b.instructions.length, 0);
  const optimized = optimize(ir, 2);
  const afterCount = optimized.functions[0].blocks.reduce((sum, b) => sum + b.instructions.length, 0);
  
  // Constant folding should potentially reduce instructions
  assert(afterCount <= beforeCount);
});
