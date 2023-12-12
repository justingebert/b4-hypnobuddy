import { Router } from 'express';
import * as goalController from "../controllers/goalController";

const goalRouter = Router();

goalRouter.post('/create', goalController.validate, goalController.createGoal);

export default goalRouter;