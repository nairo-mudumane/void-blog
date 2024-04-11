import { NotFound } from '@/controllers/not-found'
import { Express } from 'express'
import { AuthRouter } from './auth'
import { PostCategoryRouter } from './post-category'

export function ServerRoutes(server: Express) {
  server.use('/accounts/auth', AuthRouter)
  server.use('/posts/categories', PostCategoryRouter)

  server.all('*', NotFound)
}
