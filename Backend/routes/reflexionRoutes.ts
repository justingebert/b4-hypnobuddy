import { Router } from 'express';
import * as ReflexionController from '../controllers/reflexionController';

const reflexionRouter = Router();

reflexionRouter.post('/create', ReflexionController.createReflexion);
reflexionRouter.get('/getAll', ReflexionController.getReflexions);
reflexionRouter.get('/getById/:id', ReflexionController.getReflexionById);
reflexionRouter.delete('/delete/:id', ReflexionController.deleteReflexion);
reflexionRouter.put('/update/:id', ReflexionController.updateReflexion);

export default reflexionRouter;
