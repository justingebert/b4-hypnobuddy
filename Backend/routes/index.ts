import { Router } from 'express'
import userRoutes from "./userRoutes"
import goalRoutes from "./goalRoutes"

const router = Router()

router.use('/user', userRoutes)
router.use('/goal', goalRoutes)

export default router