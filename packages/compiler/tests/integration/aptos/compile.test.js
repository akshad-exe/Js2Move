/**
 * Aptos compile tests for generated packages in out/aptos
 */
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

import { fileURLToPath } from 'url';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const outRoot = path.join(projectRoot, 'out', 'aptos');

function listPackages() {
  if (!fs.existsSync(outRoot)) return [];
  return fs.readdirSync(outRoot).filter(d => fs.statSync(path.join(outRoot, d)).isDirectory());
}

function hasCmd(cmd, args = ['--version']) {
  try {
    const r = spawnSync(cmd, args, { encoding: 'utf8' });
    return !r.error && r.status === 0;
  } catch {
    return false;
  }
}

const movementAvailable = hasCmd('movement');
const movementCommand = movementAvailable ? 'movement' : null;

const aptosAvailable = hasCmd('aptos');
const userAptosPath = process.env.USERPROFILE ? path.join(process.env.USERPROFILE, '.aptoscli', 'bin', process.platform === 'win32' ? 'aptos.exe' : 'aptos') : null;
const userAptosAvailable = userAptosPath && fs.existsSync(userAptosPath);
const aptosCommand = aptosAvailable ? 'aptos' : (userAptosAvailable ? userAptosPath : null);

// dockerAvailable is true when docker is present. We will use APTOS_DOCKER_IMAGE when provided.
const dockerAvailable = hasCmd('docker');
const dockerImage = process.env.APTOS_DOCKER_IMAGE; // optional - if provided prefer docker image

// Preferred command: movement > aptos > docker image
const preferredCli = movementCommand || aptosCommand || null;


function runMoveCompile(pkgDir) {
  // Prefer Movement CLI if available (compatible with aptos commands)
  if (movementCommand) {
    const res = spawnSync(movementCommand, ['move', 'compile'], { cwd: pkgDir, encoding: 'utf8' });
    if (res.error) throw new Error(`Failed to run '${movementCommand}': ${res.error.message}`);
    if (res.status !== 0) throw new Error(`movement compile failed for ${pkgDir}: ${res.stderr || res.stdout}`);
    return res.stdout;
  }

  // Next prefer aptos CLI if available
  if (aptosCommand) {
    const res = spawnSync(aptosCommand, ['move', 'compile'], { cwd: pkgDir, encoding: 'utf8' });
    if (res.error) throw new Error(`Failed to run '${aptosCommand}': ${res.error.message}`);
    if (res.status !== 0) throw new Error(`aptos compile failed for ${pkgDir}: ${res.stderr || res.stdout}`);
    return res.stdout;
  }

  // Docker fallback: allow running movement or aptos in the given docker image
  if (dockerAvailable) {
    const mountPath = pkgDir.replace(/\\/g, '/');
    const cliToRun = process.env.APTOS_DOCKER_IMAGE_CLI === 'movement' ? 'movement' : 'aptos';
    const args = ['run', '--rm', '-v', `${mountPath}:/workspace`, '-w', '/workspace', dockerImage, cliToRun, 'move', 'compile', '--skip-fetch-latest-git-deps'];
    const res = spawnSync('docker', args, { encoding: 'utf8' });
    if (res.status !== 0) throw new Error(`Docker ${cliToRun} compile failed for ${pkgDir}: ${res.stderr || res.stdout}`);
    return res.stdout;
  }

  throw new Error("Failed to run 'movement' or 'aptos'. Install one of the CLIs (see Movement docs) or provide Docker and set APTOS_DOCKER_IMAGE.");
}

// Ensure out packages are up-to-date by invoking the build script
const buildRes = spawnSync('node', ['scripts/build-out.js'], { cwd: projectRoot, encoding: 'utf8' });
if (buildRes.status !== 0) {
  console.warn('Warning: build:out exited with non-zero status. stdout:\n', buildRes.stdout, '\nstderr:\n', buildRes.stderr);
  // continue — packages may still have been generated
}

const packages = listPackages();

test('Aptos compile: found packages', () => {
  assert(packages.length > 0, 'No packages found under out/aptos. Run `pnpm build:out` first.');
});

// Warm-up compile to populate Aptos dependency cache (first package)
// Warm-up compile to populate Aptos dependency cache (first package)
// If APTOS_DOCKER_IMAGE is provided, prefer docker-based warmup which uses the precached image
if (packages.length > 0 && (aptosAvailable || dockerAvailable)) {
  try {
    console.log('Warming Aptos dependency cache with package:', packages[0]);
    const warmPkgDir = path.join(outRoot, packages[0]);

    if (process.env.APTOS_DOCKER_IMAGE && dockerAvailable) {
      console.log('Using APTOS_DOCKER_IMAGE for warm-up:', process.env.APTOS_DOCKER_IMAGE);
      // Run docker-based compile to warm cache inside image
      const mountPath = warmPkgDir.replace(/\\/g, '/');
      const args = ['run', '--rm', '-v', `${mountPath}:/workspace`, '-w', '/workspace', process.env.APTOS_DOCKER_IMAGE, 'aptos', 'move', 'compile'];
      const r = spawnSync('docker', args, { encoding: 'utf8' });
      if (r.status !== 0) throw new Error(`Docker aptos compile warm-up failed: ${r.stderr || r.stdout}`);
      console.log('Docker warm-up output:', r.stdout || r.stderr);
    } else {
      runAptosCompile(warmPkgDir);
    }

    console.log('Aptos warm-up complete');
  } catch (err) {
    console.warn('Aptos warm-up failed (continuing):', err && err.message ? err.message : err);
  }
}

packages.forEach(pkg => {
  const testFn = (aptosAvailable || dockerAvailable) ? test : test.skip;
  // Increase timeout per package (3 minutes) to allow for initial dependency fetches
  const timeoutMs = 3 * 60 * 1000;
  testFn(`Aptos compile: ${pkg}`, { timeout: timeoutMs }, () => {
    if (!aptosAvailable && !dockerAvailable) {
      console.warn('Skipping aptos compilation tests: neither aptos CLI nor docker is available.');
      return;
    }

    const pkgDir = path.join(outRoot, pkg);
    const out = runAptosCompile(pkgDir);
    console.log(out);
    assert(out.includes('Compiling') || out.includes('Compiled'), 'Expected aptos compile output to include "Compiling" or "Compiled"');
  });
});
