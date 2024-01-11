import { Router } from 'express'
import userRoutes from "./userRoutes"
import dosAndDontsRouter from './dosAndDontsRoutes'
import goalRoutes from "./goalRoutes"

const router = Router()

router.use('/user', userRoutes);
router.use('/dosAndDonts', dosAndDontsRouter);
router.use('/goal', goalRoutes)


export default router;