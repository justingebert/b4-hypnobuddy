import { Router } from 'express'
import userRoutes from "./userRoutes"
import goalRoutes from "./goalRoutes"
import reflexionRoutes from "./reflexionRoutes"

const router = Router()

router.use('/user', userRoutes)
router.use('/goal', goalRoutes)
router.use('/reflexion', reflexionRoutes)

export default router