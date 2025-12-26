#!/usr/bin/env node
import { Command } from 'commander';
import { compileCommand } from './commands/compile';
import { buildCommand } from './commands/build';

const program = new Command();
program.name('movejs').description('MoveJS CLI').version('0.1.0');

compileCommand(program);
buildCommand(program);

program.parse(process.argv);