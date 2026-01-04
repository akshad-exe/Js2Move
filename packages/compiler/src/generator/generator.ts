/**
 * Generator - Generates Move code from AST
 */

import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { formatMoveCode } from './format.js';
import {
  ContractNode,
  ResourceDeclarationNode,
  FunctionDeclarationNode,
  ParameterDeclarationNode,
  StatementNode,
  ExpressionNode,
  NodeType,
  TemplateData,
  TemplateStruct,
  TemplateFunction,
  TemplateParam,
  GeneratorResult,
  GeneratorOptions,
} from '@js2move/shared-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Generator {
  private template: HandlebarsTemplateDelegate;

  constructor() {
    // Register helpers first (partials may use helpers)
    this.registerHelpers();

    // Load and register templates/partials (support multiple .hbs files)
    const templatesDir = path.join(__dirname, '../templates');

    if (fs.existsSync(templatesDir)) {
      const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.hbs'));

      // Register each template as a partial (name variants: kebab, underscore, condensed)
      for (const f of files) {
        const filePath = path.join(templatesDir, f);
        const source = fs.readFileSync(filePath, 'utf8');
        const base = f.replace(/\.move\.hbs$/, '').replace(/\.hbs$/, '');
        const underscored = base.replace(/-/g, '_');
        const condensed = base.replace(/[-_]/g, '');

        Handlebars.registerPartial(base, source);
        if (underscored !== base) Handlebars.registerPartial(underscored, source);
        if (condensed !== base && condensed !== underscored) Handlebars.registerPartial(condensed, source);
      }

      const mainTemplatePath = path.join(templatesDir, 'contract.move.hbs');
      if (fs.existsSync(mainTemplatePath)) {
        const templateSource = fs.readFileSync(mainTemplatePath, 'utf-8');
        this.template = Handlebars.compile(templateSource);
        return;
      }
    }

    // Fallback inline template for development
    this.template = Handlebars.compile(this.getDefaultTemplate());
  }

  /**
   * Generate Move code from AST
   */
  generate(ast: ContractNode, options?: GeneratorOptions): GeneratorResult {
    const data = this.astToTemplateData(ast);
    const code = this.template(data);

    // Format generated code using internal formatter
    const formattedCode = formatMoveCode(code, options?.indentSize || 2);

    return {
      code: formattedCode,
      warnings: [],
    };
  }

  /**
   * Convert AST to template data
   */
  private astToTemplateData(ast: ContractNode): TemplateData {
    const structs: TemplateStruct[] = [];
    const functions: TemplateFunction[] = [];

    // Process contract body
    for (const node of ast.body) {
      if (node.type === NodeType.RESOURCE_DECLARATION) {
        structs.push(this.convertResource(node as ResourceDeclarationNode));
      } else if (node.type === NodeType.FUNCTION_DECLARATION) {
        functions.push(this.convertFunction(node as FunctionDeclarationNode));
      }
    }

    return {
      moduleName: ast.name.name,
      imports: [
        { module: 'std::signer' },
        { module: 'std::vector' },
      ],
      structs,
      functions,
      constants: [],
    };
  }

  /**
   * Convert resource to template struct
   */
  private convertResource(node: ResourceDeclarationNode): TemplateStruct {
    return {
      name: node.name.name,
      abilities: ['key', 'store'],
      fields: node.fields?.map(field => ({
        name: field.name.name,
        type: field.typeAnnotation.typeName,
      })) || [{ name: 'value', type: 'u64' }], // Default field if none specified
      isResource: true,
    };
  }

  /**
   * Convert function to template function
   */
  private convertFunction(node: FunctionDeclarationNode): TemplateFunction {
    const params = node.parameters.map(p => this.convertParameter(p));
    const acquires = this.findAcquires(node);

    return {
      visibility: 'public entry',
      name: node.name.name,
      params,
      returnType: node.returnType?.typeName,
      acquires,
      statements: this.convertStatements(node.body.statements),
      hasReturn: this.hasReturnStatement(node.body.statements),
    };
  }

  /**
   * Convert parameter
   */
  private convertParameter(node: ParameterDeclarationNode): TemplateParam {
    const typeName = node.typeAnnotation.typeName;
    const isSigner = typeName === 'signer';

    return {
      name: node.name.name,
      type: typeName,
      isSigner,
      isReference: isSigner,
      isMutable: false,
    };
  }

  /**
   * Convert statements to template statements
   */
  private convertStatements(statements: StatementNode[]): any[] {
    return statements.map(stmt => ({
      type: this.getStatementType(stmt),
      code: this.statementToCode(stmt),
    }));
  }

  /**
   * Convert statement to Move code
   */
  private statementToCode(stmt: StatementNode): string {
    switch (stmt.type) {
      case NodeType.EXPRESSION_STATEMENT:
        return this.expressionToCode(stmt.expression) + ';';
      
      case NodeType.RETURN_STATEMENT:
        if (stmt.argument) {
          return `return ${this.expressionToCode(stmt.argument)};`;
        }
        return 'return;';
      
      case NodeType.IF_STATEMENT:
        let code = `if (${this.expressionToCode(stmt.condition)}) ${this.statementToCode(stmt.consequent)}`;
        if (stmt.alternate) {
          code += ` else ${this.statementToCode(stmt.alternate)}`;
        }
        return code;
      
      case NodeType.WHILE_STATEMENT:
        return `while (${this.expressionToCode(stmt.condition)}) ${this.statementToCode(stmt.body)}`;
      
      case NodeType.ASSERT_STATEMENT:
        return `assert!(${this.expressionToCode(stmt.condition)}, ERROR_ASSERTION_FAILED);`;
      
      case NodeType.BLOCK_STATEMENT:
        const statements = stmt.statements.map(s => '      ' + this.statementToCode(s)).join('\n');
        return `{\n${statements}\n    }`;
      
      default:
        return '// Unknown statement';
    }
  }

  /**
   * Convert expression to Move code
   */
  private expressionToCode(expr: ExpressionNode): string {
    switch (expr.type) {
      case NodeType.IDENTIFIER:
        return expr.name;
      
      case NodeType.NUMBER_LITERAL:
        return expr.value.toString();
      
      case NodeType.STRING_LITERAL:
        return `b"${expr.value}"`;
      
      case NodeType.BOOLEAN_LITERAL:
        return expr.value ? 'true' : 'false';
      
      case NodeType.BINARY_EXPRESSION:
        return `${this.expressionToCode(expr.left)} ${expr.operator} ${this.expressionToCode(expr.right)}`;
      
      case NodeType.ASSIGNMENT_EXPRESSION:
        // Handle resource indexing (e.g., Balance[account] = value)
        if (expr.left.type === NodeType.INDEX_EXPRESSION) {
          const obj = this.expressionToCode(expr.left.object);
          const index = this.expressionToCode(expr.left.index);
          const value = this.expressionToCode(expr.right);
          
          if (expr.operator === '=') {
            return `move_to(${index}, ${obj} { value: ${value} })`;
          } else if (expr.operator === '+=') {
            return `borrow_global_mut<${obj}>(${index}).value = borrow_global_mut<${obj}>(${index}).value + ${value}`;
          } else if (expr.operator === '-=') {
            return `borrow_global_mut<${obj}>(${index}).value = borrow_global_mut<${obj}>(${index}).value - ${value}`;
          }
        }
        return `${this.expressionToCode(expr.left)} ${expr.operator} ${this.expressionToCode(expr.right)}`;
      
      case NodeType.CALL_EXPRESSION:
        const args = expr.arguments.map(arg => this.expressionToCode(arg)).join(', ');
        return `${this.expressionToCode(expr.callee)}(${args})`;
      
      case NodeType.MEMBER_EXPRESSION:
        return `${this.expressionToCode(expr.object)}.${expr.property.name}`;
      
      case NodeType.INDEX_EXPRESSION:
        return `borrow_global<${this.expressionToCode(expr.object)}>(${this.expressionToCode(expr.index)}).value`;
      
      default:
        return '/* unknown expression */';
    }
  }

  /**
   * Find resources that need to be acquired
   */
  private findAcquires(node: FunctionDeclarationNode): string[] {
    // Simple heuristic: look for resource names in statements
    // TODO: Implement proper analysis
    return [];
  }

  /**
   * Check if function has return statement
   */
  private hasReturnStatement(statements: StatementNode[]): boolean {
    return statements.some(stmt => stmt.type === NodeType.RETURN_STATEMENT);
  }

  /**
   * Get statement type for template
   */
  private getStatementType(stmt: StatementNode): string {
    switch (stmt.type) {
      case NodeType.EXPRESSION_STATEMENT: return 'expression';
      case NodeType.RETURN_STATEMENT: return 'return';
      case NodeType.IF_STATEMENT: return 'if';
      case NodeType.WHILE_STATEMENT: return 'while';
      case NodeType.ASSERT_STATEMENT: return 'assert';
      default: return 'unknown';
    }
  }

  // Formatting is handled by `format.ts` in this folder (formatMoveCode)


  /**
   * Default template fallback
   */
  private getDefaultTemplate(): string {
    return `module {{moduleName}} {
  {{#each imports}}
  use {{module}};
  {{/each}}

  {{#each structs}}
  struct {{name}} has {{#each abilities}}{{this}}{{#unless @last}}, {{/unless}}{{/each}} {
    {{#each fields}}
    {{name}}: {{type}},
    {{/each}}
  }

  {{/each}}
  {{#each functions}}
  {{visibility}} fun {{name}}(
    {{#each params}}
    {{name}}: {{#if isSigner}}&signer{{else}}{{type}}{{/if}}{{#unless @last}},{{/unless}}
    {{/each}}
  ){{#if returnType}}: {{returnType}}{{/if}}{{#if acquires}} acquires {{#each acquires}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}} {
    {{#each statements}}
    {{{code}}}
    {{/each}}
  }

  {{/each}}
}`;
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    Handlebars.registerHelper('join', (array: any[], separator: string) => {
      return array.join(separator);
    });

    Handlebars.registerHelper('capitalize', (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });
  }
}

/**
 * Generate Move code from AST
 */
export function generate(ast: ContractNode, options?: GeneratorOptions): GeneratorResult {
  const generator = new Generator();
  return generator.generate(ast, options);
}
