/**
 * IR Optimizer
 * Performs optimization passes on IR
 */

import { IRModule, IRFunction, IRBasicBlock, IRInstruction, IROpCode } from './ir-builder.js';

/**
 * Optimization pass interface
 */
export interface OptimizationPass {
  name: string;
  run(module: IRModule): IRModule;
}

/**
 * Constant Folding Pass
 * Evaluates constant expressions at compile time
 */
export class ConstantFoldingPass implements OptimizationPass {
  name = 'constant-folding';

  run(module: IRModule): IRModule {
    for (const func of module.functions) {
      for (const block of func.blocks) {
        block.instructions = this.foldConstants(block.instructions);
      }
    }
    return module;
  }

  private foldConstants(instructions: IRInstruction[]): IRInstruction[] {
    const result: IRInstruction[] = [];
    const stack: number[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const inst = instructions[i];

      // Try to fold arithmetic operations
      if (inst.opcode === IROpCode.PUSH) {
        stack.push(inst.operands[0] as number);
        result.push(inst);
      } else if ([IROpCode.ADD, IROpCode.SUB, IROpCode.MUL, IROpCode.DIV].includes(inst.opcode)) {
        if (stack.length >= 2 && result[result.length - 1]?.opcode === IROpCode.PUSH && result[result.length - 2]?.opcode === IROpCode.PUSH) {
          // Both operands are constants - fold them
          const right = stack.pop()!;
          const left = stack.pop()!;
          
          let value: number;
          switch (inst.opcode) {
            case IROpCode.ADD: value = left + right; break;
            case IROpCode.SUB: value = left - right; break;
            case IROpCode.MUL: value = left * right; break;
            case IROpCode.DIV: value = Math.floor(left / right); break;
            default: value = 0;
          }

          // Remove the two PUSH instructions
          result.pop();
          result.pop();

          // Push folded result
          result.push({
            opcode: IROpCode.PUSH,
            operands: [value],
            comment: `folded: ${left} ${this.opToSymbol(inst.opcode)} ${right}`,
          });
          stack.push(value);
        } else {
          result.push(inst);
          stack.length = 0; // Clear stack on non-constant operation
        }
      } else {
        result.push(inst);
        stack.length = 0; // Clear stack
      }
    }

    return result;
  }

  private opToSymbol(opcode: IROpCode): string {
    switch (opcode) {
      case IROpCode.ADD: return '+';
      case IROpCode.SUB: return '-';
      case IROpCode.MUL: return '*';
      case IROpCode.DIV: return '/';
      default: return '?';
    }
  }
}

/**
 * Dead Code Elimination Pass
 * Removes unreachable code
 */
export class DeadCodeEliminationPass implements OptimizationPass {
  name = 'dead-code-elimination';

  run(module: IRModule): IRModule {
    for (const func of module.functions) {
      func.blocks = this.eliminateDeadCode(func);
    }
    return module;
  }

  private eliminateDeadCode(func: IRFunction): IRBasicBlock[] {
    const reachable = new Set<string>();
    const worklist: string[] = [];

    // Start with entry block
    if (func.blocks.length > 0) {
      worklist.push(func.blocks[0].label);
    }

    // Mark reachable blocks
    while (worklist.length > 0) {
      const label = worklist.pop()!;
      if (reachable.has(label)) continue;

      reachable.add(label);

      const block = func.blocks.find(b => b.label === label);
      if (block) {
        for (const successor of block.successors) {
          if (!reachable.has(successor)) {
            worklist.push(successor);
          }
        }
      }
    }

    // Filter out unreachable blocks
    return func.blocks.filter(block => reachable.has(block.label));
  }
}

/**
 * IR Optimizer
 */
export class IROptimizer {
  private passes: OptimizationPass[] = [];

  constructor() {
    // Register default optimization passes
    this.addPass(new ConstantFoldingPass());
    this.addPass(new DeadCodeEliminationPass());
  }

  addPass(pass: OptimizationPass): void {
    this.passes.push(pass);
  }

  optimize(module: IRModule, level: number = 1): IRModule {
    let optimized = module;

    // Run passes based on optimization level
    const iterations = level === 0 ? 0 : level === 1 ? 1 : 3;

    for (let i = 0; i < iterations; i++) {
      for (const pass of this.passes) {
        optimized = pass.run(optimized);
      }
    }

    return optimized;
  }
}

/**
 * Optimize IR module
 */
export function optimize(module: IRModule, level: number = 1): IRModule {
  const optimizer = new IROptimizer();
  return optimizer.optimize(module, level);
}
