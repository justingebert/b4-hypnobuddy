import { Router } from 'express';
import * as goalController from "../controllers/goalController";

const goalRouter = Router();

goalRouter.post('/create', goalController.createGoal);
goalRouter.get('/getAll', goalController.getAllGoals); //include the user id in the request body
goalRouter.get('/:goalId', goalController.getGoal);
goalRouter.post('/delete/:goalId', goalController.deleteGoal)
goalRouter.post('/update/:goalId', goalController.updateGoal)
goalRouter.post('/reorder', goalController.updateGoalOrder)



export default goalRouter;