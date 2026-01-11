import { compilerController } from './compiler.controller';
import { gasController } from './gas.controller';
import { deploymentController } from './deployment.controller';
import { blockchainController } from './blockchain.controller';
import { examplesController } from './examples.controller';
import { moveJSErrorController } from './movejs-error.controller';
import { healthController } from './health.controller';

export const publicControllers = {
  compilerController,
  gasController,
  deploymentController,
  blockchainController,
  examplesController,
  moveJSErrorController,
  healthController,
};
