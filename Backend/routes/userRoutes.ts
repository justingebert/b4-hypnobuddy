import { Router } from 'express';
import * as userController from "../controllers/userController";

const userRouter = Router();

userRouter.post('/create', userController.validate, userController.create);
userRouter.post('/login', userController.authenticate, userController.currentUser);
userRouter.post('/logout', userController.logout);
userRouter.get('/currentUser', userController.currentUser);
userRouter.get('/profile/data', userController.currentUser)
userRouter.get('/profile/patients', userController.isAuthenticated, userController.getPatients);

userRouter.post('/verify', userController.isAuthenticated, userController.verifyTherapist);
userRouter.post('/link', userController.isAuthenticated, userController.linkPatientToTherapist);
userRouter.get('/getAllPatients', userController.getAllPatients);
userRouter.post('/getAllPatientsLinked', userController.getAllPatientsLinked);

export default userRouter;