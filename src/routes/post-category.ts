import * as controller from '@/controllers/post-category'
import { AuthMiddleware } from '@/middleware/auth'
import { Application, Router } from 'express'

const router = Router()
const { privateRoute } = new AuthMiddleware()

router.post('/', privateRoute, controller.create as Application)

export { router as PostCategoryRouter }
