import { Router } from 'express';
import * as goalController from "../controllers/goalController";

const goalRouter = Router();

goalRouter.get('/test', goalController.test);

export default goalRouter;