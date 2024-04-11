import { NewUser } from '@/@types'
import { ERROR_MESSAGES } from '@/config'
import { ApiReturn } from '@/http/api-return'
import bcrypt from '@/lib/bcrypt'
import jwt from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { payloadHandler } from '@/payload-handler'
import { Request, Response } from 'express'

export async function signup(request: Request, response: Response) {
  const payload = request.body as NewUser

  try {
    const { email } = payloadHandler.auth.signup(payload)!

    const exists = await prisma.user.findFirst({ where: { email } })
    if (exists) throw new Error(ERROR_MESSAGES.userAlreadyRegistered)

    const totalAdmins = await prisma.user.count({ where: { role: 'admin' } })
    if (totalAdmins <= 0) payload['role'] = 'admin'
    else payload['role'] = 'blogger'
    payload['email'] = email.toLowerCase()
  } catch (error) {
    return response
      .status(400)
      .json(ApiReturn({ message: (error as Error).message }))
  }

  try {
    const hashedPassword = await bcrypt.hash(payload.password!)
    const created = await prisma.user.create({
      data: {
        name: payload.name!,
        email: payload.email!,
        password: hashedPassword,
        role: payload.role!,
      },
    })
    const token = jwt.getToken({ id: created.id, email: created.email })

    return response
      .status(201)
      .json(
        ApiReturn(
          { count: 1, data: { ...created, token } },
          { remove: ['password'] },
        ),
      )
  } catch (error) {
    return response
      .status(500)
      .json(ApiReturn({ message: (error as Error).message }))
  }
}
