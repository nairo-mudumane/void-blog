import * as controller from '@/controllers/auth'
import { Router } from 'express'

const router = Router()

router.post('/signup', controller.signup)

export { router as AuthRouter }
