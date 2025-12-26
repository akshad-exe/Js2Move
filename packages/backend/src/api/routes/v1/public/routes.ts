import { Router } from 'express';
import { publicControllers } from '@/api/controllers/v1/public';
import validateCompile from '@/middlewares/validateCompile';
import { rateLimitMiddleware } from '@/middlewares/ratelimit.middleware';

const router: Router = Router();

// Compiler endpoints
router.post('/compiler/compile', rateLimitMiddleware, validateCompile, publicControllers.compilerController.compile);

// Example endpoints
router.get('/example/hello', publicControllers.exampleController.getHello);

export default router;
