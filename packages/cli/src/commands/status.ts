import { Command } from 'commander';
import fetch from 'node-fetch';

export function statusCommand(program: Command) {
  program
    .command('status')
    .description('Query deployment status by transaction hash')
    .argument('<txHash>', 'Transaction hash')
    .option('--host <url>', 'Backend host', 'http://localhost:8000')
    .action(async (txHash: string, opts: { host?: string }) => {
      const url = `${opts.host}/api/v1/public/deployment/status/${encodeURIComponent(txHash)}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) {
          console.error('Status query failed', data);
          process.exit(1);
        }
        console.log(JSON.stringify(data, null, 2));
      } catch (err: any) {
        console.error('Failed to call backend:', err.message || err);
        process.exit(1);
      }
    });
}
