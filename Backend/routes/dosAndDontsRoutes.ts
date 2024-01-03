import { Router } from 'express';
import * as dosAndDontsController from "../controllers/dosAndDontsController";
import * as fearController from "../controllers/fearController";

const dosAndDontsRouter = Router();

dosAndDontsRouter.get('/dosAndDonts', dosAndDontsController.getDosAndDonts);
dosAndDontsRouter.get('/dosAndDonts/:id', dosAndDontsController.getDoOrDontById);
dosAndDontsRouter.get('/fears', fearController.getFears)
dosAndDontsRouter.get('/fears/:fearId', fearController.getFearById);
dosAndDontsRouter.post('/fears', fearController.saveFear);
dosAndDontsRouter.post('/fears/addDoAndDont', fearController.addDoAndDontToFear);
dosAndDontsRouter.post('/fears/addUserToFear', fearController.addUserToFear);
dosAndDontsRouter.put('/dosAndDonts/:id', dosAndDontsController.updateDoAndDont);
dosAndDontsRouter.put('/fears/:fearId', fearController.updateFearName);
dosAndDontsRouter.post('/fears/deleteUserToFear', fearController.deleteUserToFear);
dosAndDontsRouter.delete('/fears/:fearId', dosAndDontsController.deleteFearAndDosAndDonts);
export default dosAndDontsRouter;
