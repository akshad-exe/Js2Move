/**
 * Regenerate all expected fixture outputs
 * Run this when the compiler output format changes
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compile } from '../dist/compiler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, 'fixtures');
const inputDir = path.join(fixturesDir, 'input');
const expectedDir = path.join(fixturesDir, 'expected');

// Get all input files
const inputFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.movejs'));

console.log(`🔄 Regenerating ${inputFiles.length} fixture outputs...\n`);

inputFiles.forEach(filename => {
  const inputPath = path.join(inputDir, filename);
  const outputFilename = filename.replace('.movejs', '.move');
  const outputPath = path.join(expectedDir, outputFilename);
  
  try {
    const source = fs.readFileSync(inputPath, 'utf-8');
    const result = compile(source, { skipSemanticAnalysis: true });
    const code = typeof result === 'string' ? result : result.code;
    
    fs.writeFileSync(outputPath, code, 'utf-8');
    console.log(`✅ ${filename} → ${outputFilename}`);
  } catch (error) {
    console.error(`❌ ${filename}: ${error.message}`);
  }
});

console.log(`\n✨ Done! Run 'pnpm test tests/fixtures.test.js' to verify.`);
