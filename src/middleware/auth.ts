import { AuthRequest, User } from '@/@types'
import { ERROR_MESSAGES } from '@/config'
import jwt from '@/helpers/jwt'
import { prisma } from '@/lib/prisma'
import { NextFunction, Request, Response } from 'express'

export class AuthMiddleware {
  private static errorStatusCode: number = 401
  private static unknownOrigin: string = ERROR_MESSAGES.unknownOriginOrUser
  private static invalidTokenStructure: string =
    ERROR_MESSAGES.invalidOrExpiredToken

  public async publicRoute(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) throw new Error(AuthMiddleware.unknownOrigin)
      else {
        const parts = authHeader.split(' ')
        if (parts.length !== 2)
          throw new Error(AuthMiddleware.invalidTokenStructure)

        const [scheme, token] = parts
        if (!/^Bearer$/i.test(scheme))
          throw new Error(AuthMiddleware.invalidTokenStructure)

        return jwt.verify(token, async (err, decoded) => {
          try {
            if (err) throw new Error(err.message)

            if (!decoded) throw new Error(AuthMiddleware.unknownOrigin)

            const user = await prisma.user.findFirst({
              where: { id: String(decoded.id) },
            })

            if (!user) throw new Error(AuthMiddleware.unknownOrigin)

            ;(request as AuthRequest)['user'] = user as User
            return next()
          } catch (error) {
            throw new Error((error as Error).message)
          }
        })
      }
    } catch (error) {
      return response
        .status(AuthMiddleware.errorStatusCode)
        .json({ message: (error as Error).message })
    }
  }

  public async privateRoute(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) throw new Error(AuthMiddleware.invalidTokenStructure)

      const parts = authHeader.split(' ')
      if (parts.length !== 2)
        throw new Error(AuthMiddleware.invalidTokenStructure)

      const [scheme, token] = parts
      if (!/^Bearer$/i.test(scheme))
        throw new Error(AuthMiddleware.invalidTokenStructure)

      return jwt.verify(token, async (err, decoded) => {
        try {
          if (err) throw new Error(err.message)

          if (!decoded) throw new Error(AuthMiddleware.unknownOrigin)

          const user = await prisma.user.findFirst({
            where: { id: String(decoded.id) },
          })

          if (!user) throw new Error(AuthMiddleware.unknownOrigin)

          ;(request as AuthRequest)['user'] = user as User

          return next()
        } catch (error) {
          return response
            .status(AuthMiddleware.errorStatusCode)
            .json({ message: (error as Error).message })
        }
      })
    } catch (error) {
      return response
        .status(AuthMiddleware.errorStatusCode)
        .json({ message: (error as Error).message })
    }
  }
}
