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

import { spawnSync } from 'child_process';
import os from 'os';

// Normalize strings for comparison: unify CRLF/LF, trim trailing whitespace, collapse excessive blank lines
function normalizeForCompare(s) {
  if (!s) return '';
  let out = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Trim trailing whitespace on non-blank lines
  out = out.split('\n').map(l => (l.trim() === '' ? '' : l.replace(/\s+$/, ''))).join('\n');
  // Collapse runs of 3+ blank lines into exactly 2
  out = out.replace(/(\n){3,}/g, '\n\n');
  // Normalize to CRLF for comparison with fixtures on Windows
  out = out.replace(/\n/g, '\r\n');
  // Trim leading/trailing whitespace/newlines
  out = out.replace(/^\s+|\s+$/g, '');
  return out;
}

// Try to format using official Move formatters (prefer $FORMATTER_EXE, then 'move fmt', then 'aptos move fmt')
// If none succeed, warn and return the original input (so tests can still run locally).
function tryFormatWithOfficial(input) {
  try {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'js2move-'));
    const tmpPath = path.join(tmpDir, 'out.move');
    fs.writeFileSync(tmpPath, input, 'utf8');

    const attempts = [];
    const envExe = process.env.FORMATTER_EXE;
    if (envExe) attempts.push({ cmd: envExe, args: [tmpPath] });
    attempts.push({ cmd: 'move', args: ['fmt', tmpPath] });
    attempts.push({ cmd: 'aptos', args: ['move', 'fmt', tmpPath] });

    for (const attempt of attempts) {
      try {
        const res = spawnSync(attempt.cmd, attempt.args, { windowsHide: true, encoding: 'utf8' });
        const cmdDisplay = `${attempt.cmd} ${attempt.args.join(' ')}`;

        if (res.error) {
          // Command not found or execution error; try next
          // Formatter attempt failed; continue to next candidate.
          continue;
        }

        if (res.status === 0) {
          // Success — read file (formatter typically formats in-place)
          const formatted = fs.readFileSync(tmpPath, 'utf8');
          fs.rmSync(tmpDir, { recursive: true, force: true });
          return formatted;
        } else {
          // Formatter returned non-zero; continue to next candidate.
          continue;
        }
      } catch (e) {
        console.debug('[fixtures.test] Formatter execution error:', e && e.message ? e.message : e);
        continue;
      }
    }

    // Neither formatter succeeded: cleanup and fall back
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.warn('[fixtures.test] Official Move formatter not found or failed; falling back to internal formatting');
    return input;
  } catch (e) {
    console.warn('[fixtures.test] Formatting with official tools failed:', e && e.message ? e.message : e);
    return input;
  }
}


const fixturesDir = path.join(__dirname, 'fixtures');
const inputDir = path.join(fixturesDir, 'input');
const expectedDir = path.join(fixturesDir, 'expected');

// Auto-detect a formatter binary (if not explicitly set) in common locations
if (!process.env.FORMATTER_EXE) {
  const candidates = [];
  const homedir = os.homedir();
  if (homedir) candidates.push(path.join(homedir, '.aptoscli', 'bin', process.platform === 'win32' ? 'movefmt.exe' : 'movefmt'));
  candidates.push('/usr/local/bin/movefmt', '/usr/bin/movefmt');
  for (const c of candidates) {
    try { if (fs.existsSync(c)) { process.env.FORMATTER_EXE = c; break; } } catch (e) {}
  }
}

// If an official formatter is installed via FORMATTER_EXE, use it for canonical formatting without noisy per-file logs
if (process.env.FORMATTER_EXE && fs.existsSync(process.env.FORMATTER_EXE)) {
  console.warn('[fixtures.test] Official movefmt found at', process.env.FORMATTER_EXE);
}

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
    const expectedRaw = fs.readFileSync(expectedPath, 'utf-8');
    // Normalize expected using the official formatter if available so both sides use the same canonical formatting
    const expectedFormatted = tryFormatWithOfficial(expectedRaw);
    const expected = normalizeForCompare(expectedFormatted);

    // Compile
    const result = compile(input, { skipSemanticAnalysis: true });
    const outputRaw = (typeof result === 'string' ? result : result.code);

    // Try to format via official Move formatter(s); fall back to original if not available
    const formattedByOfficial = tryFormatWithOfficial(outputRaw);
    const output = normalizeForCompare(formattedByOfficial);

    // Compare
    if (output !== expected) {
      // On mismatch, include short diagnostic in message
      const msg = `Generated code doesn't match expected output for ${fixtureName}\n` +
                  `--- Expected (normalized) ---\n${expected.slice(0, 800)}\n...\n` +
                  `--- Output (normalized) ---\n${output.slice(0, 800)}\n...`;
      assert.strictEqual(output, expected, msg);
    }
  });
});

test(`Found ${fixtureFiles.length} fixtures`, () => {
  assert(fixtureFiles.length > 0, 'No fixtures found!');
  console.log(`  📋 Testing fixtures: ${fixtureFiles.join(', ')}`);
});
