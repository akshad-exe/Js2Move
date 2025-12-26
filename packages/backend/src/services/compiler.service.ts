import { tokenize, parse, toIR, generateMove } from '@js2move/compiler';

export async function compile(source: string): Promise<string> {
  if (typeof source !== 'string') throw new Error('source must be a string');
  const tokens = tokenize(source);
  const ast = parse(tokens);
  const ir = toIR(ast);
  const move = generateMove(ir);
  return move;
}
