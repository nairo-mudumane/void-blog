import { ApiReturn } from '@/http/api-return'
import { prisma } from '@/lib/prisma'
import { Request, Response } from 'express'

export async function list(request: Request, response: Response) {
  try {
    const posts = await prisma.post.findMany({ include: { createdBy: true } })

    return response.status(200).send(ApiReturn({ data: posts }))
  } catch (error) {
    return response
      .status(500)
      .send(ApiReturn({ message: (error as Error).message }))
  }
}
