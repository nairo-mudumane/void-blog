import { NotFound } from '@/controllers/not-found'
import { Express } from 'express'
import { AuthRouter } from './auth'

export function ServerRoutes(server: Express) {
  server.use('/accounts/auth', AuthRouter)

  server.all('*', NotFound)
}
