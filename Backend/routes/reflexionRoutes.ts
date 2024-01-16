import express from 'express';
import * as ReflexionController from '../controllers/reflexionController';

const reflexionRouter = express.Router();

reflexionRouter.post('/reflexions', ReflexionController.createReflexion);
reflexionRouter.get('/reflexions', ReflexionController.getReflexions);
reflexionRouter.get('/reflexions/:id', ReflexionController.getReflexionById);
reflexionRouter.delete('/reflexions/:id', ReflexionController.deleteReflexion);
reflexionRouter.put('/reflexions/:id', ReflexionController.updateReflexion);

export default reflexionRouter;
