import { Router } from 'express'
import userRoutes from "./userRoutes"
import dosAndDontsRouter from './dosAndDontsRoutes'

const router = Router()

router.use('/user', userRoutes);
router.use('/dosAndDonts', dosAndDontsRouter);


export default router;