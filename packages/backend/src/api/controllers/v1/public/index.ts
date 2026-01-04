import { compilerController } from './compiler.controller';
import { gasController } from './gas.controller';
import { deploymentController } from './deployment.controller';
import { blockchainController } from './blockchain.controller';
import { examplesController } from './examples.controller';

export const publicControllers = {
  compilerController,
  gasController,
  deploymentController,
  blockchainController,
  examplesController,
};
