import { AuthRequest, NewPostCategory } from '@/@types'
import { ERROR_MESSAGES } from '@/config'
import { ApiReturn } from '@/http/api-return'
import { prisma } from '@/lib/prisma'
import { payloadHandler } from '@/payload-handler'
import { Response } from 'express'

export async function create(request: AuthRequest, response: Response) {
  const payload = request.body as NewPostCategory
  const reqUser = request.user

  try {
    if (reqUser.role !== 'admin') throw new Error(ERROR_MESSAGES.notAllowed)

    const { label } = payloadHandler.post.createPostCategory(payload)!

    const exists = await prisma.postCategory.findFirst({ where: { label } })
    if (exists) throw new Error('categoria já existe')
  } catch (error) {
    return response
      .status(400)
      .json(ApiReturn({ message: (error as Error).message }))
  }

  try {
    const created = await prisma.postCategory.create({
      data: {
        label: payload.label!,
        createdById: reqUser.id,
      },
    })

    return response
      .status(201)
      .json(
        ApiReturn(
          { count: 1, data: created },
          { remove: ['createdById', 'created'] },
        ),
      )
  } catch (error) {
    return response
      .status(500)
      .json(ApiReturn({ message: (error as Error).message }))
  }
}
