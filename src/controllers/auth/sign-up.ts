import { ERROR_MESSAGES } from '@/config'
import { ApiReturn } from '@/http/api-return'
import bcrypt from '@/lib/bcrypt'
import { prisma } from '@/lib/prisma'
import { payloadHandler } from '@/payload-handler'
import { Request, Response } from 'express'
import { NewUser } from 'user'

export async function signup(request: Request, response: Response) {
  const payload = request.body as NewUser

  try {
    const { email } = payloadHandler.auth.signup(payload)!

    const exists = await prisma.user.findFirst({ where: { email } })
    if (exists) throw new Error(ERROR_MESSAGES.userAlreadyRegistered)

    payload['email'] = email.toLowerCase()
  } catch (error) {
    return response
      .status(400)
      .json(ApiReturn({ message: (error as Error).message }))
  }

  try {
    const hashedPassword = await bcrypt.hash(payload.password!)
    const created = await prisma.user.create({
      data: { email: payload.email, password: hashedPassword },
    })

    return response
      .status(201)
      .json(ApiReturn({ count: 1, data: created }, { remove: ['password'] }))
  } catch (error) {
    return response
      .status(500)
      .json(ApiReturn({ message: (error as Error).message }))
  }
}
