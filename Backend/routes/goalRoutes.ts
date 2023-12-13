import { Router } from 'express';
import * as goalController from "../controllers/goalController";

const goalRouter = Router();

goalRouter.post('/create', goalController.createGoal);
goalRouter.get('/getAll', goalController.getAllGoals); //include the user id in the request body
goalRouter.get('/:goalId', goalController.getGoal);

export default goalRouter;