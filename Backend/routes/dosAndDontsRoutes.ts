import { Router } from 'express';
import * as dosAndDontsController from "../controllers/dosAndDontsController";

const dosAndDontsRouter = Router();

dosAndDontsRouter.get('/dosAndDonts', dosAndDontsController.getDosAndDonts);
dosAndDontsRouter.post('/dosAndDonts', dosAndDontsController.saveDoAndDont);

export default dosAndDontsRouter;
