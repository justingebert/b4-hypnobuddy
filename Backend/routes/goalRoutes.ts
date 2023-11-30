import { Router } from 'express';
import * as goalController from "../controllers/goalController";

const goalRouter = Router();

goalRouter.post('/create', goalController.validate, goalController.createGoal);
//include the user id in the request body
goalRouter.get('/getAll', goalController.getAllGoals);
//TODO: goalRouter.get('/get/:id', goalController.getGoal);

export default goalRouter;