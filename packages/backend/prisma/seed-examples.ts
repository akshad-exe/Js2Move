import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function loadExamples() {
  const examplesDir = path.resolve(process.cwd(), '../compiler/examples');
  const files = fs.readdirSync(examplesDir).filter((f: string) => f.endsWith('.movejs'));

  const descriptions: Record<string, { name: string; description: string; difficulty: string }> = {
    '01': { name: 'Hello World', description: 'Simplest possible contract showing basic structure and syntax', difficulty: 'beginner' },
    '02': { name: 'Simple Token', description: 'Basic token with balance tracking, transfer functions, and access control', difficulty: 'beginner' },
    '03': { name: 'NFT Contract', description: 'Non-fungible token pattern with minting and transfer capabilities', difficulty: 'intermediate' },
    '04': { name: 'DeFi Vault', description: 'Advanced DeFi pattern with deposits, withdrawals, and yield farming', difficulty: 'advanced' },
    '05': { name: 'Voting Contract', description: 'Democratic voting system with proposals, voting, and result tallying', difficulty: 'intermediate' }
  };

  for (const filename of files) {
    const base = filename.replace('.movejs', '');
    const parts = base.split('-');
    const id = parts[0];
    const nameFromFile = parts.length > 1 ? parts.slice(1).join(' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : undefined;
    const filePath = path.join(examplesDir, filename);
    const source = fs.readFileSync(filePath, 'utf-8');

    const meta = descriptions[id] || {
      name: nameFromFile ?? id,
      description: nameFromFile ? `Example contract: ${nameFromFile}` : `Example contract: ${id}`,
      difficulty: 'intermediate'
    };

    await prisma.example.upsert({
      where: { id },
      update: {
        name: meta.name,
        description: meta.description,
        difficulty: meta.difficulty,
        source,
      },
      create: {
        id,
        name: meta.name,
        description: meta.description,
        difficulty: meta.difficulty,
        source,
      }
    });

    console.log(`Upserted example ${id} (${meta.name})`);
  }
}

loadExamples()
  .then(async () => {
    console.log('Seeding completed');
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('Seeding failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });