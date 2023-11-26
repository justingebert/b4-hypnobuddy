import { Router } from 'express';
import * as fearController from '../controllers/fearController';

const fearRouter = Router();

fearRouter.get('/fears', fearController.getFears);
fearRouter.get('/fears/:fearId', fearController.getFearById);
fearRouter.post('/fears', fearController.saveFear);
fearRouter.post('/fears/addDoAndDont', fearController.addDoAndDontToFear);

export default fearRouter;
