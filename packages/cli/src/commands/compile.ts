import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { compile as js2moveCompile } from '@js2move/compiler';

async function isFile(p: string) {
  try {
    const stat = await fs.stat(p);
    return stat.isFile();
  } catch {
    return false;
  }
}

export function compileCommand(program: Command) {
  program
    .command('compile')
    .description('Compile a MoveJS source file or inline source')
    .option('-s, --source <fileOrSource>', 'Source file path or inline source')
    .option('-o, --out <file>', 'Output path (defaults to stdout)')
    .action(async (opts: { source?: string; out?: string }) => {
      if (!opts.source) {
        console.error('No source provided. Use -s <fileOrSource>');
        process.exit(1);
      }

      let source = opts.source as string;
      if (await isFile(source)) {
        source = await fs.readFile(source, 'utf8');
      }

      const result = js2moveCompile(source);
      const move = typeof result === 'string' ? result : result.code;

      if (opts.out) {
        const outPath = path.resolve(process.cwd(), opts.out);
        await fs.writeFile(outPath, move, 'utf8');
        console.log(`Wrote Move output to ${outPath}`);
      } else {
        process.stdout.write(move);
      }
    });
}
