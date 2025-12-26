import { Command } from 'commander';
import fs from 'fs/promises';
import { tokenize, parse, toIR, generateMove } from '@js2move/compiler';
import path from 'path';

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
    .action(async (opts) => {
      if (!opts.source) {
        console.error('No source provided. Use -s <fileOrSource>');
        process.exit(1);
      }

      let source = opts.source;
      if (await isFile(source)) {
        source = await fs.readFile(source, 'utf8');
      }

      const tokens = tokenize(source);
      const ast = parse(tokens);
      const ir = toIR(ast);
      const move = generateMove(ir);

      if (opts.out) {
        const outPath = path.resolve(process.cwd(), opts.out);
        await fs.writeFile(outPath, move, 'utf8');
        console.log(`Wrote Move output to ${outPath}`);
      } else {
        process.stdout.write(move);
      }
    });
}
