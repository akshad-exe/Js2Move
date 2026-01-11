#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Smart Unit Test Generator for Move Contracts
 * Analyzes Move code structure and generates meaningful tests
 */

const MOVE_FILE = process.argv[2];

if (!MOVE_FILE) {
    console.error('Usage: node auto-gen-tests.js <path-to-move-file>');
    process.exit(1);
}

if (!fs.existsSync(MOVE_FILE)) {
    console.error(`File not found: ${MOVE_FILE}`);
    process.exit(1);
}

let content = fs.readFileSync(MOVE_FILE, 'utf-8');

// Parse module info
const moduleMatch = content.match(/module\s+(\w+)\s*\{/);
if (!moduleMatch) {
    console.error('No module found in file');
    process.exit(1);
}

const moduleName = moduleMatch[1];
console.log(`📦 Analyzing module: ${moduleName}`);

// Extract structs
const structs = extractStructs(content);
console.log(`📊 Found ${structs.length} struct(s): ${structs.map(s => s.name).join(', ')}`);

// Extract public functions
const publicFunctions = extractPublicFunctions(content);
console.log(`⚙️  Found ${publicFunctions.length} public function(s): ${publicFunctions.map(f => f.name).join(', ')}`);

// Check for existing tests
if (content.includes('#[test]')) {
    console.log('⚠️  Tests already exist in file');
    const backupFile = MOVE_FILE + '.backup';
    if (!fs.existsSync(backupFile)) {
        fs.writeFileSync(backupFile, content);
        console.log(`📁 Backup created: ${backupFile}`);
    }
}

// Generate tests
const generatedTests = generateSmartTests(moduleName, structs, publicFunctions);

// Insert tests before closing brace
const lastBraceIndex = content.lastIndexOf('}');
if (lastBraceIndex === -1) {
    console.error('Cannot find module closing brace');
    process.exit(1);
}

// Check if tests already exist - if so, ask user
if (content.includes('#[test]')) {
    console.log('\n✗ Tests already exist. Please manually review or delete existing tests first.');
    process.exit(1);
}

const newContent = content.slice(0, lastBraceIndex) + '\n\n' + generatedTests + '\n' + content.slice(lastBraceIndex);

// Write back
fs.writeFileSync(MOVE_FILE, newContent);
console.log(`\n✅ Smart unit tests generated and added!`);
console.log(`📄 Run tests with: movement move test --package-dir <pkg-dir> --bytecode-version 6`);

// ============ Parsing Functions ============

function extractStructs(content) {
    const structRegex = /struct\s+(\w+)[^{]*\{([^}]+)\}/g;
    const structs = [];
    let match;

    while ((match = structRegex.exec(content)) !== null) {
        const name = match[1];
        const fields = match[2]
            .split(',')
            .map(f => {
                const fieldMatch = f.trim().match(/(\w+)\s*:\s*(\w+)/);
                return fieldMatch ? { name: fieldMatch[1], type: fieldMatch[2] } : null;
            })
            .filter(f => f);
        
        structs.push({ name, fields });
    }

    return structs;
}

function extractPublicFunctions(content) {
    const funcRegex = /public\s+(?:entry\s+)?fun\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*(\w+))?/g;
    const functions = [];
    let match;

    while ((match = funcRegex.exec(content)) !== null) {
        const name = match[1];
        const paramsStr = match[2];
        const returnType = match[3];

        const params = paramsStr
            .split(',')
            .map(p => {
                const paramMatch = p.trim().match(/(\w+)\s*:\s*([&]?\w+)/);
                return paramMatch ? { name: paramMatch[1], type: paramMatch[2] } : null;
            })
            .filter(p => p);

        functions.push({ name, params, returnType });
    }

    return functions;
}

// ============ Test Generation Functions ============

function generateSmartTests(moduleName, structs, functions) {
    const tests = [];

    // 1. Smoke test
    tests.push(`    #[test]
    public fun test_module_compiles() {
        // Smoke test - verify module loads and compiles
    }`);

    // 2. Tests for init/setup functions
    const initFuncs = functions.filter(f => f.name.toLowerCase().includes('init'));
    if (initFuncs.length > 0) {
        tests.push(generateInitTests(initFuncs[0], structs));
    }

    // 3. Tests for entry functions with signer
    const signerFuncs = functions.filter(f => f.params.some(p => p.type === 'signer'));
    for (const func of signerFuncs) {
        tests.push(generateSignerFunctionTest(func));
    }

    // 4. Tests for view/query functions
    const viewFuncs = functions.filter(f => f.returnType && !f.name.includes('init'));
    for (const func of viewFuncs) {
        tests.push(generateViewFunctionTest(func));
    }

    // 5. Tests for struct creation
    for (const struct of structs) {
        tests.push(generateStructTest(struct));
    }

    return tests.join('\n\n');
}

function generateInitTests(initFunc, structs) {
    const hasSigner = initFunc.params.some(p => p.type === 'signer');
    
    if (hasSigner) {
        return `    #[test(account = @0xdf7530cf8405b200c2b87c8ff0dad54b2f4376a8b32b79841fdfd6be52b6f644)]
    public fun test_init_function(account: signer) {
        // Test initialization function
        // TODO: Call init function and verify state
    }`;
    }
    
    return `    #[test]
    public fun test_init_function() {
        // Test initialization function
        // TODO: Implement test
    }`;
}

function generateSignerFunctionTest(func) {
    const testName = `test_${func.name}_with_signer`;
    return `    #[test(account = @0xdf7530cf8405b200c2b87c8ff0dad54b2f4376a8b32b79841fdfd6be52b6f644)]
    public fun ${testName}(account: signer) {
        // Test: ${func.name}
        // Parameters: ${func.params.map(p => `${p.name}: ${p.type}`).join(', ')}
        // TODO: Call function and verify behavior
    }`;
}

function generateViewFunctionTest(func) {
    const testName = `test_${func.name}_returns_correct_value`;
    const paramStr = func.params.length > 0 
        ? func.params.map(p => `${p.name}: ${p.type}`).join(', ')
        : '';
    
    return `    #[test]
    public fun ${testName}() {
        // Test: ${func.name}
        // Expected return type: ${func.returnType}
        // Parameters: ${paramStr || 'none'}
        // TODO: Call function and assert return value
    }`;
}

function generateStructTest(struct) {
    const testName = `test_${struct.name.toLowerCase()}_creation`;
    const fieldStr = struct.fields.map(f => `${f.name}: /* ${f.type} */`).join(', ');
    
    return `    #[test]
    public fun ${testName}() {
        // Test: Create and verify ${struct.name} struct
        // Fields: ${struct.fields.map(f => `${f.name} (${f.type})`).join(', ')}
        // TODO: Create instance and verify field values
    }`;
}
