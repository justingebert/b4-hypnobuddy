import { Router } from 'express'
import userRoutes from "./userRoutes"
import dosAndDontsRouter from './dosAndDontsRoutes'
import fearRouter from "./fearRoutes";

const router = Router()

router.use('/user', userRoutes);
router.use('/dosAndDonts', dosAndDontsRouter);
router.use('/fear', fearRouter);


export default router;