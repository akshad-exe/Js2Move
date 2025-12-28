/**
 * Integration Test Suite - Full Compiler Pipeline
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { compile } from '../dist/compiler.js';

test('Compiler: should compile simple contract', () => {
  const source = 'contract Test { resource R { v: u64 }; }';
  const result = compile(source, { skipSemanticAnalysis: true });
  
  const code = typeof result === 'string' ? result : result.code;
  assert(code.includes('module Test'));
  assert(code.includes('struct R'));
});

test('Compiler: should compile with functions', () => {
  const source = `contract Token {
    resource Balance { amount: u64 };
    
    mint(account: signer, value: u64) {
      Balance[account] = value;
    }
  }`;
  
  const result = compile(source, { skipSemanticAnalysis: true });
  const code = typeof result === 'string' ? result : result.code;
  
  assert(code.includes('module Token'));
  assert(code.includes('struct Balance'));
  assert(code.includes('fun mint'));
});

test('Compiler: should support optimization levels', () => {
  const source = 'contract Test { resource R { v: u64 }; calc(): u64 { return 10 + 20; } }';
  
  const result = compile(source, {
    skipSemanticAnalysis: true,
    optimizationLevel: 2,
    outputIR: true,
  });
  
  assert(typeof result === 'object');
  assert(result.code);
  assert(result.ir);
  assert(result.ir.functions.length > 0);
});

test('Compiler: should handle multiple resources and functions', () => {
  const source = `contract Bank {
    resource Balance { amount: u64 };
    resource Account { owner: address };
    
    deposit(acc: signer, val: u64) {
      Balance[acc] = val;
    }
    
    withdraw(addr: address): u64 {
      return Balance[addr];
    }
  }`;
  
  const result = compile(source, { skipSemanticAnalysis: true });
  const code = typeof result === 'string' ? result : result.code;
  
  assert(code.includes('struct Balance'));
  assert(code.includes('struct Account'));
  assert(code.includes('fun deposit'));
  assert(code.includes('fun withdraw'));
});

test('Compiler: should format output', () => {
  const source = 'contract Test { resource R { v: u64 }; }';
  
  const result = compile(source, {
    skipSemanticAnalysis: true,
    format: 'pretty',
    indentSize: 2,
  });
  
  const code = typeof result === 'string' ? result : result.code;
  const lines = code.split('\n');
  
  assert(lines.length > 5); // Pretty formatted should have multiple lines
});
