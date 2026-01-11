import { Router } from 'express';
import { publicControllers } from '@/api/controllers/v1/public';
import  validateCompile  from '@/api/middleware/validate.compile';
import validateDeploy from '@/api/middleware/validate.deploy';
import { rateLimitMiddleware } from '@/api/middleware/ratelimit.middleware';

const router: Router = Router();

// Compiler endpoints
router.post('/compiler/compile', rateLimitMiddleware, validateCompile, publicControllers.compilerController.compile);
router.post('/compiler/validate', rateLimitMiddleware, publicControllers.compilerController.validate);
router.post('/compiler/analyze', rateLimitMiddleware, publicControllers.compilerController.analyze);

// Gas endpoints
router.post('/gas/estimate', rateLimitMiddleware, publicControllers.gasController.estimateGas);
router.get('/gas/price', publicControllers.gasController.getGasPrice);

// Deployment endpoints
router.post('/deploy', rateLimitMiddleware, validateDeploy, publicControllers.deploymentController.deploy);
router.post('/deploy/compile', rateLimitMiddleware, validateCompile, publicControllers.deploymentController.compile);
router.post('/deploy/submit', rateLimitMiddleware, publicControllers.deploymentController.submit);
router.get('/deployments', publicControllers.deploymentController.list);
router.get('/deployment/history', publicControllers.deploymentController.history);
router.get('/deployment/:id', publicControllers.deploymentController.get);
router.get('/deployment/status/:txHash', publicControllers.deploymentController.status);

// Blockchain helper endpoints
router.get('/network/status', publicControllers.blockchainController.getNetworkStatus);
router.get('/transaction/:hash', publicControllers.blockchainController.getTransaction);
router.get('/account/:address', publicControllers.blockchainController.getAccount);

// Examples endpoints
router.get('/examples', publicControllers.examplesController.getExamples);
router.get('/example/:id', publicControllers.examplesController.getExample);

// MoveJS Error Analyzer endpoints
router.post('/movejs/analyze-error', rateLimitMiddleware, publicControllers.moveJSErrorController.analyzeError);
router.post('/movejs/validate', rateLimitMiddleware, publicControllers.moveJSErrorController.validate);
router.post('/movejs/error-report', rateLimitMiddleware, publicControllers.moveJSErrorController.errorReport);
router.post('/movejs/auto-fix', rateLimitMiddleware, publicControllers.moveJSErrorController.autoFix);


export default router;
