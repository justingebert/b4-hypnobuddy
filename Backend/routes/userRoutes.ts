import { Router } from 'express';
import * as userController from "../controllers/userController";

const userRouter = Router();

userRouter.post('/create', userController.validate, userController.create);
userRouter.post('/login', userController.authenticate, userController.currentUser);
userRouter.post('/logout', userController.logout);
userRouter.get('/currentUser', userController.currentUser);
userRouter.get('/profile/data', userController.currentUser)

userRouter.post('/verify', userController.isAuthenticated ,userController.verifyTherapist);
userRouter.post('/link', userController.isAuthenticated, userController.linkPatientToTherapist);

export default userRouter;