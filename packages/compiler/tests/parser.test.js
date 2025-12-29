/**
 * Parser Test Suite
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../dist/lexer/lexer.js';
import { parse } from '../dist/parser/parser.js';

test('Parser: should parse contract declaration', () => {
  const source = 'contract Test {}';
  const tokens = tokenize(source).tokens;
  const result = parse(tokens);
  
  assert.strictEqual(result.ast.type, 'Contract');
  assert.strictEqual(result.ast.name.name, 'Test');
  assert.strictEqual(result.ast.body.length, 0);
  assert.strictEqual(result.errors.length, 0);
});

test('Parser: should parse resource with fields', () => {
  const source = 'contract Test { resource Balance { value: u64 }; }';
  const tokens = tokenize(source).tokens;
  const result = parse(tokens);
  
  assert.strictEqual(result.ast.body.length, 1);
  assert.strictEqual(result.ast.body[0].type, 'ResourceDeclaration');
  assert.strictEqual(result.ast.body[0].name.name, 'Balance');
  assert.strictEqual(result.ast.body[0].fields.length, 1);
  assert.strictEqual(result.ast.body[0].fields[0].name.name, 'value');
  assert.strictEqual(result.ast.body[0].fields[0].typeAnnotation.typeName, 'u64');
});

test('Parser: should parse function with parameters', () => {
  const source = 'contract Test { test(x: u64, y: bool): u64 { return x; } }';
  const tokens = tokenize(source).tokens;
  const result = parse(tokens);
  
  const func = result.ast.body[0];
  assert.strictEqual(func.type, 'FunctionDeclaration');
  assert.strictEqual(func.name.name, 'test');
  assert.strictEqual(func.parameters.length, 2);
  assert.strictEqual(func.parameters[0].name.name, 'x');
  assert.strictEqual(func.parameters[1].name.name, 'y');
  assert.strictEqual(func.returnType.typeName, 'u64');
});

test('Parser: should parse expressions', () => {
  const source = 'contract Test { test() { x = a + b * 2; } }';
  const tokens = tokenize(source).tokens;
  const result = parse(tokens);
  
  const stmt = result.ast.body[0].body.statements[0];
  assert.strictEqual(stmt.type, 'ExpressionStatement');
  assert.strictEqual(stmt.expression.type, 'AssignmentExpression');
});

test('Parser: should parse control flow', () => {
  const source = 'contract Test { test() { if (x > 0) { return x; } } }';
  const tokens = tokenize(source).tokens;
  const result = parse(tokens);
  
  const stmt = result.ast.body[0].body.statements[0];
  assert.strictEqual(stmt.type, 'IfStatement');
  assert.strictEqual(stmt.condition.type, 'BinaryExpression');
  assert.strictEqual(stmt.consequent.type, 'BlockStatement');
});
