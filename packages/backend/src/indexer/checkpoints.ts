import fs from 'fs/promises';
import path from 'path';

const CHECKPOINT_FILE = path.join(process.cwd(), 'data', 'indexer-checkpoint.json');

export async function readCheckpoint(): Promise<{ lastIndexedBlock?: number }> {
  try {
    const raw = await fs.readFile(CHECKPOINT_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

export async function writeCheckpoint(data: { lastIndexedBlock?: number }) {
  try {
    await fs.mkdir(path.dirname(CHECKPOINT_FILE), { recursive: true });
    await fs.writeFile(CHECKPOINT_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Failed to write checkpoint file', err);
  }
}
