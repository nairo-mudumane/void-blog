import { LoginUser } from '@/@types'
import { isValidEmail } from '@/helpers'
import { ApiReturn } from '@/http/api-return'
import bcrypt from '@/lib/bcrypt'
import jwt from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { Request, Response } from 'express'

export async function login(request: Request, response: Response) {
  const { email, password } = request.body as LoginUser
  const invalidLoginMessage = 'nome de usuário ou senha incorretos'

  try {
    if (!email && password) throw new Error(invalidLoginMessage)

    if (!isValidEmail(email)) throw new Error(invalidLoginMessage)

    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) throw new Error(invalidLoginMessage)

    if (!(await bcrypt.compare(password!, user.password!)))
      throw new Error(invalidLoginMessage)

    const token = jwt.getToken({ id: user.id, email: user.email })

    return response
      .status(200)
      .json(
        ApiReturn(
          { count: 1, data: { ...user, token } },
          { remove: ['password'] },
        ),
      )
  } catch (error) {
    return response.status(403).json({ message: (error as Error).message })
  }
}
