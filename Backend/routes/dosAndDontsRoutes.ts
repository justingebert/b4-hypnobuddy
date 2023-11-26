import { Router } from 'express';
import * as dosAndDontsController from "../controllers/dosAndDontsController";
import * as fearController from "../controllers/fearController";

const dosAndDontsRouter = Router();

dosAndDontsRouter.get('/dosAndDonts', dosAndDontsController.getDosAndDonts);
dosAndDontsRouter.get('/fears', fearController.getFears)
dosAndDontsRouter.get('dosAndDonts/:fearId', fearController.getFearById);
dosAndDontsRouter.post('/dosAndDonts', dosAndDontsController.saveDoAndDont, fearController.saveFear);
dosAndDontsRouter.post('/fears', fearController.saveFear);
dosAndDontsRouter.post('/dosAndDonts/addDoAndDont', fearController.addDoAndDontToFear);
export default dosAndDontsRouter;
