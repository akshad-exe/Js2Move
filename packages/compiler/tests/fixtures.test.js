/**
 * Fixture-Based Test Suite
 * Automatically tests all fixtures in input/ against expected/
 */
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compile } from '../dist/compiler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, 'fixtures');
const inputDir = path.join(fixturesDir, 'input');
const expectedDir = path.join(fixturesDir, 'expected');

// Auto-discover all fixture files
const fixtureFiles = fs.readdirSync(inputDir)
  .filter(f => f.endsWith('.movejs'))
  .map(f => f.replace('.movejs', ''));

// Create a test for each fixture
fixtureFiles.forEach(fixtureName => {
  test(`Fixture: ${fixtureName}`, () => {
    const inputPath = path.join(inputDir, `${fixtureName}.movejs`);
    const expectedPath = path.join(expectedDir, `${fixtureName}.move`);
    
    // Read fixture files
    const input = fs.readFileSync(inputPath, 'utf-8');
    const expected = fs.readFileSync(expectedPath, 'utf-8').trim();
    
    // Compile
    const result = compile(input, { skipSemanticAnalysis: true });
    const output = (typeof result === 'string' ? result : result.code).trim();
    
    // Compare
    assert.strictEqual(output, expected, 
      `Generated code doesn't match expected output for ${fixtureName}`);
  });
});

test(`Found ${fixtureFiles.length} fixtures`, () => {
  assert(fixtureFiles.length > 0, 'No fixtures found!');
  console.log(`  📋 Testing fixtures: ${fixtureFiles.join(', ')}`);
});
