import { Router } from 'express';
import * as goalController from "../controllers/goalController";

const goalRouter = Router();

goalRouter.post('/create',goalController.validate ,goalController.createGoal);
goalRouter.get('/getAll', goalController.getAllGoals);
goalRouter.get('/:goalId', goalController.getGoal);
goalRouter.post('/delete/:goalId', goalController.deleteGoal)
goalRouter.post('/update/:goalId', goalController.updateGoal)
goalRouter.post('/reorder', goalController.updateGoalOrder)
goalRouter.post('/createSubGoal', goalController.createSubGoal)

export default goalRouter;