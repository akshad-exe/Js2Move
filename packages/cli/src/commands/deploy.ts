import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

async function isFile(p: string) {
  try {
    const stat = await fs.stat(p);
    return stat.isFile();
  } catch {
    return false;
  }
}

export function deployCommand(program: Command) {
  program
    .command('deploy')
    .description('Deploy compiled Move source or MoveJS source via backend')
    .option('-s, --source <fileOrSource>', 'Source file path or inline source')
    .option('-n, --network <network>', "Network ('testnet'|'mainnet')", 'testnet')
    .option('-m, --module <moduleName>', 'Module name (optional)')
    .option('--host <url>', 'Backend host', 'http://localhost:8000')
    .action(async (opts: { source?: string; network?: string; module?: string; host?: string }) => {
      if (!opts.source) {
        console.error('No source provided. Use -s <fileOrSource>');
        process.exit(1);
      }

      let source = opts.source as string;
      const resolvedPath = path.resolve(process.cwd(), source);
      if (await isFile(resolvedPath)) {
        source = await fs.readFile(resolvedPath, 'utf8');
      }

      const payload = {
        source,
        network: opts.network,
        moduleName: opts.module,
      } as any;

      const url = `${opts.host}/api/v1/public/deploy`;

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error('Deploy failed', data);
          process.exit(1);
        }

        console.log(JSON.stringify(data, null, 2));
      } catch (err: any) {
        console.error('Failed to call backend:', err.message || err);
        process.exit(1);
      }
    });
}
