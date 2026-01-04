import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { compile as js2moveCompile } from '@js2move/compiler';

function findMoveJsFiles(dir: string): Promise<string[]> {
  return fs.readdir(dir).then((files) => files.filter((f) => f.endsWith('.movejs')).map((f) => path.join(dir, f)));
}

export function buildCommand(program: Command) {
  program
    .command('build')
    .description('Compile all .movejs files in the current directory')
    .option('-o, --out-dir <dir>', 'Output directory for generated Move files', 'out')
    .action(async (opts: { outDir: string }) => {
      const cwd = process.cwd();
      const files = await findMoveJsFiles(cwd);
      if (files.length === 0) {
        console.log('No .movejs files found in current directory.');
        return;
      }

      await fs.mkdir(path.resolve(cwd, opts.outDir), { recursive: true });

      for (const file of files) {
        const src = await fs.readFile(file, 'utf8');
        const result = js2moveCompile(src);
        const move = typeof result === 'string' ? result : result.code;
        const outFile = path.join(opts.outDir, path.basename(file).replace(/\.movejs$/i, '.move'));
        await fs.writeFile(outFile, move, 'utf8');
        console.log(`Compiled ${file} → ${outFile}`);
      }
    });
}
