// Simple test of the compiler
import { compile } from '../dist/compiler.js';

const source = `contract SimpleToken {
  resource Balance { value: u64 };

  initialize(account: signer, initialAmount: u64) {
    Balance[account] = initialAmount;
  }
}`;

console.log('📝 Compiling MoveJS...\n');

try {
  const result = compile(source, { 
    format: 'pretty', 
    indentSize: 2,
    skipSemanticAnalysis: true  // Skip for now
  });
  const code = typeof result === 'string' ? result : result.code;
  
  console.log('✅ Success! Generated Move code:\n');
  console.log(code);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
