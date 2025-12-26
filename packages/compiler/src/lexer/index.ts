export type Token = {
  type: string;
  value?: string;
  line?: number;
  col?: number;
};

/**
 * Simple regex-based tokenizer stub for DSL proof-of-concept.
 * Returns an array of tokens with basic metadata.
 */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const regex = /\b(contract|resource|init|assert|fun|let|pub|entry|signer)\b|[{};(),]|[A-Za-z_][A-Za-z0-9_]*/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    const text = match[0];
    tokens.push({ type: text, value: text, line: 0, col: match.index });
  }
  return tokens;
}
