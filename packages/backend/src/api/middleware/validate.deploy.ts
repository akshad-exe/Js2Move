import { Request, Response, NextFunction } from 'express';

export default function validateDeploy(req: Request, res: Response, next: NextFunction) {
  const { source, network, moduleName, gasLimit } = req.body;

  if (typeof source !== 'string') {
    return res.status(400).json({ error: 'Missing required field: source (string)' });
  }

  if (network && !['testnet', 'mainnet'].includes(network)) {
    return res.status(400).json({ error: 'Invalid network, must be "testnet" or "mainnet"' });
  }

  if (moduleName && typeof moduleName !== 'string') {
    return res.status(400).json({ error: 'Invalid moduleName' });
  }

  if (gasLimit && typeof gasLimit !== 'number') {
    return res.status(400).json({ error: 'Invalid gasLimit, must be a number' });
  }

  if (req.body.moveToml && typeof req.body.moveToml !== 'string') {
    return res.status(400).json({ error: 'Invalid moveToml, must be a string containing Move.toml content' });
  }

  next();
}
