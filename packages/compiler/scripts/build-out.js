/**
 * Build all examples and fixtures into aptos packages under out/aptos
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compile } from '../dist/compiler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const outRoot = path.join(projectRoot, 'out', 'aptos');
const examplesDir = path.join(projectRoot, 'examples');
const fixturesDir = path.join(projectRoot, 'tests', 'fixtures', 'input');

function slugify(name) {
  return name.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase();
}

function extractContractName(source) {
  const m = source.match(/contract\s+([A-Za-z0-9_]+)/);
  return m ? m[1] : null;
}

function makeMoveToml(pkgName) {
  return `# Auto-generated Move.toml
[package]
name = "${pkgName}"
version = "0.1.0"
authors = ["MoveJS <dev@movementlabs.xyz>"]

[dependencies]
aptos_framework = { git = "https://github.com/aptos-labs/aptos-core.git", rev = "v7.4.0", subdir = "aptos-framework" }

[addresses]
std = "0x1"
`;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writePackage(pkgName, moduleName, code) {
  const pkgDir = path.join(outRoot, pkgName);
  const sourcesDir = path.join(pkgDir, 'sources');
  ensureDir(sourcesDir);

  const toml = makeMoveToml(pkgName);
  fs.writeFileSync(path.join(pkgDir, 'Move.toml'), toml, 'utf-8');

  const fileName = `${moduleName}.move`;
  fs.writeFileSync(path.join(sourcesDir, fileName), code, 'utf-8');
}

function buildFromFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf-8');
  let contractName = extractContractName(src);
  if (!contractName || contractName.length < 2) {
    // fallback to filename if extraction looks wrong
    contractName = path.basename(filePath).replace(/\.[^.]+$/, '');
  }

  const pkgName = slugify(contractName);
  const moduleName = contractName;

  try {
    const result = compile(src, { skipSemanticAnalysis: true, format: 'pretty', indentSize: 2 });
    let code = typeof result === 'string' ? result : result.code;

    // Wrap in address block for Aptos compilation
    code = `address 0x1 {\n${code}\n}`;

    writePackage(pkgName, moduleName, code);
    console.log(`Wrote package: ${pkgName} (${filePath})`);
  } catch (err) {
    console.warn(`Skipping ${filePath} - compile failed:\n  ${err.message.split('\n').slice(0,2).join('\n  ')}\n`);
  }
}

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.movejs')).map(f => path.join(dir, f));
}

function main() {
  ensureDir(outRoot);

  const exampleFiles = collectFiles(examplesDir);
  const fixtureFiles = collectFiles(fixturesDir);

  const files = Array.from(new Set([...exampleFiles, ...fixtureFiles]));
  files.forEach(buildFromFile);

  console.log('\nDone. Generated packages in', outRoot);
}

main();
