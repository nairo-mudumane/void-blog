import * as controller from '@/controllers/auth'
import { Router } from 'express'

const router = Router()

router.post('/signup', controller.signup)
router.post('/login', controller.login)

export { router as AuthRouter }
