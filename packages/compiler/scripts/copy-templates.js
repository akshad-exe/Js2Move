import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const srcTemplates = path.join(projectRoot, 'src', 'templates');
const outTemplates = path.join(projectRoot, 'dist', 'templates');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyTemplates() {
  if (!fs.existsSync(srcTemplates)) return;
  ensureDir(outTemplates);
  const files = fs.readdirSync(srcTemplates).filter(f => f.endsWith('.hbs'));
  for (const f of files) {
    const src = path.join(srcTemplates, f);
    const dest = path.join(outTemplates, f);
    fs.copyFileSync(src, dest);
  }
  console.log('Copied templates to', outTemplates);
}

copyTemplates();
