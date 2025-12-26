export type ASTNode = {
  type: string;
  [k: string]: any;
};

export type Program = ASTNode & { body: ASTNode[] };
