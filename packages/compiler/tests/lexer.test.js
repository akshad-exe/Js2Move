/**
 * Lexer Test Suite
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../dist/lexer/lexer.js';

test('Lexer: should tokenize keywords correctly', () => {
  const source = 'contract resource function';
  const result = tokenize(source);
  
  assert.strictEqual(result.tokens.length, 4); // 3 keywords + EOF
  assert.strictEqual(result.tokens[0].type, 'CONTRACT');
  assert.strictEqual(result.tokens[1].type, 'RESOURCE');
  assert.strictEqual(result.tokens[2].type, 'FUNCTION');
  assert.strictEqual(result.errors.length, 0);
});

test('Lexer: should tokenize identifiers and literals', () => {
  const source = 'myVar 123 "hello" true';
  const result = tokenize(source);
  
  assert.strictEqual(result.tokens[0].type, 'IDENTIFIER');
  assert.strictEqual(result.tokens[0].value, 'myVar');
  assert.strictEqual(result.tokens[1].type, 'NUMBER');
  assert.strictEqual(result.tokens[1].value, '123');
  assert.strictEqual(result.tokens[2].type, 'STRING_LITERAL');
  assert.strictEqual(result.tokens[3].type, 'TRUE');
});

test('Lexer: should tokenize operators', () => {
  const source = '+ - * / += == && ||';
  const result = tokenize(source);
  
  assert.strictEqual(result.tokens[0].type, 'PLUS');
  assert.strictEqual(result.tokens[1].type, 'MINUS');
  assert.strictEqual(result.tokens[2].type, 'MULTIPLY');
  assert.strictEqual(result.tokens[3].type, 'DIVIDE');
  assert.strictEqual(result.tokens[4].type, 'PLUS_ASSIGN');
  assert.strictEqual(result.tokens[5].type, 'EQUAL');
  assert.strictEqual(result.tokens[6].type, 'AND');
  assert.strictEqual(result.tokens[7].type, 'OR');
});

test('Lexer: should handle comments', () => {
  const source = `// line comment
  contract Test /* block comment */ {`;
  
  const result = tokenize(source);
  
  assert.strictEqual(result.tokens[0].type, 'CONTRACT');
  assert.strictEqual(result.tokens[1].type, 'IDENTIFIER');
  assert.strictEqual(result.tokens[2].type, 'LBRACE');
});

test('Lexer: should track location information', () => {
  const source = 'contract\nTest';
  const result = tokenize(source);
  
  assert.strictEqual(result.tokens[0].location.line, 1);
  assert.strictEqual(result.tokens[1].location.line, 2);
});
