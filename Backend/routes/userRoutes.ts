import { Router } from 'express';
import * as userController from "../controllers/userController";
import passport from 'passport';

const userRouter = Router();

userRouter.post('/create', userController.validate, userController.create);
userRouter.post('/login', userController.authenticate, userController.currentUser);
userRouter.post('/logout', userController.logout);
userRouter.get('/c', userController.currentUser);

export default userRouter;