import * as controller from '@/controllers/post'
import * as categoryController from '@/controllers/post-category'
import { AuthMiddleware } from '@/middleware/auth'
import { imageUpload } from '@/middleware/multer'
import { Application, Router } from 'express'

const router = Router()
const { privateRoute } = new AuthMiddleware()

router.get('/', controller.list)
router.post(
  '/',
  privateRoute,
  imageUpload.single('media'),
  controller.create as Application,
)
router.post(
  '/sync-offline',
  privateRoute,
  imageUpload.array('media'),
  controller.createOffline as Application,
)
router.post(
  '/categories',
  privateRoute,
  categoryController.create as Application,
)

export { router as PostRouter }
