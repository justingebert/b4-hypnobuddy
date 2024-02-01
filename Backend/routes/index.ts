import { Router } from 'express'
import userRoutes from "./userRoutes"
import dosAndDontsRouter from './dosAndDontsRoutes'
import goalRoutes from "./goalRoutes"
import reflexionRoutes from "./reflexionRoutes"

const router = Router()

router.use('/user', userRoutes);
router.use('/dosAndDonts', dosAndDontsRouter);
router.use('/goal', goalRoutes)
router.use('/reflexion', reflexionRoutes)
router.use('/user', userRoutes)
router.use('/goal', goalRoutes)

export default router