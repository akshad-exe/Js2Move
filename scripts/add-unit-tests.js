#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Automatically add unit tests to Move source files
 * Usage: node add-unit-tests.js <path-to-move-file>
 */

const MOVE_FILE = process.argv[2];

if (!MOVE_FILE) {
    console.error('Usage: node add-unit-tests.js <path-to-move-file>');
    process.exit(1);
}

if (!fs.existsSync(MOVE_FILE)) {
    console.error(`File not found: ${MOVE_FILE}`);
    process.exit(1);
}

// Read the Move file
let content = fs.readFileSync(MOVE_FILE, 'utf-8');

// Parse module info
const moduleMatch = content.match(/module\s+(\w+)\s*\{/);
if (!moduleMatch) {
    console.error('No module found in file');
    process.exit(1);
}

const moduleName = moduleMatch[1];

// Find all public functions
const functionRegex = /public\s+(?:entry\s+)?fun\s+(\w+)\s*\([^)]*\)[^{]*\{/g;
const functions = [];
let match;

while ((match = functionRegex.exec(content)) !== null) {
    functions.push(match[1]);
}

console.log(`Found module: ${moduleName}`);
console.log(`Found functions: ${functions.join(', ')}`);

// Generate test cases
const testCases = generateTests(moduleName, functions);

// Find the insertion point (before closing brace of module)
const lastBraceIndex = content.lastIndexOf('}');
if (lastBraceIndex === -1) {
    console.error('Cannot find module closing brace');
    process.exit(1);
}

// Check if tests already exist
if (content.includes('#[test]')) {
    console.log('Tests already exist in file. Backing up original...');
    const backupFile = MOVE_FILE + '.backup';
    fs.writeFileSync(backupFile, content);
    console.log(`Backup created: ${backupFile}`);
    
    // Ask user to review
    console.log('Please review existing tests before adding new ones.');
    process.exit(0);
}

// Insert tests before the closing brace
const newContent = content.slice(0, lastBraceIndex) + '\n' + testCases + '\n' + content.slice(lastBraceIndex);

// Write back
fs.writeFileSync(MOVE_FILE, newContent);
console.log(`✓ Unit tests added to ${MOVE_FILE}`);

function generateTests(moduleName, functions) {
    const tests = [];
    
    // Add a basic smoke test
    tests.push(`    #[test]
    public fun test_module_exists() {
        // Smoke test: verify module compiles
    }`);
    
    // Generate tests for each public function
    for (const func of functions) {
        if (func === 'test_module_exists') continue; // Skip if already exists
        
        const testName = `test_${func}`;
        tests.push(`
    #[test]
    public fun ${testName}() {
        // Test for ${func}
        // TODO: Implement test logic
    }`);
    }
    
    return tests.join('\n');
}
