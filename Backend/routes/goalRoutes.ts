import { Router } from 'express';
import * as goalController from "../controllers/goalController";

const goalRouter = Router();

goalRouter.post('/create',goalController.validate ,goalController.createGoal);
goalRouter.get('/getAll', goalController.getAllGoals);
goalRouter.get('/ofPatient/:patientID', goalController.getGoalsOfPatient);
goalRouter.get('/:goalId', goalController.getGoal);
goalRouter.post('/delete/:goalId', goalController.deleteGoal)
goalRouter.post('/update/:goalId', goalController.updateGoal)
goalRouter.post('/reorder', goalController.updateGoalOrder)
goalRouter.post('/createSubGoal', goalController.createSubGoal)
goalRouter.post('/saveComment', goalController.addComment)
goalRouter.post('/deleteComment/:commentId', goalController.deleteComment)

export default goalRouter;