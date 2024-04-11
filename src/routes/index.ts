import { NotFound } from '@/controllers/not-found'
import { Express } from 'express'
import { AuthRouter } from './auth'
import { PostRouter } from './post'

export function ServerRoutes(server: Express) {
  server.use('/accounts/auth', AuthRouter)
  server.use('/posts', PostRouter)

  server.all('*', NotFound)
}
