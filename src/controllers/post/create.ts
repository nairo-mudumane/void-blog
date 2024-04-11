import { AuthRequest, NewPost, Post, PostCategory, UndoPartial } from '@/@types'
import { removeFile } from '@/helpers'
import { ApiReturn } from '@/http/api-return'
import { prisma } from '@/lib/prisma'
import R2 from '@/lib/r2'
import { payloadHandler } from '@/payload-handler'
import { Response } from 'express'

export async function create(request: AuthRequest, response: Response) {
  const { file } = request
  const reqUser = request.user
  const payload = request.body as NewPost

  try {
    if (!file?.filename) throw new Error('O media do artigo é obrigatório')

    const { title, categoryId } = payloadHandler.post.createPost(payload)!

    let exists: PostCategory | Post | null = null
    exists = (await prisma.post.findFirst({ where: { title } })) as Post
    if (exists) throw new Error('artigo já cadastrado')

    exists = (await prisma.postCategory.findFirst({
      where: { id: categoryId },
    })) as PostCategory
    if (!exists) throw new Error('categoria não reconhecida')
  } catch (error) {
    if (file) removeFile(file.path)
    return response
      .status(400)
      .json(ApiReturn({ message: (error as Error).message }))
  }

  try {
    const r2 = new R2()
    const media = await r2.upload({
      ContentType: file.mimetype,
      fileKey: file.filename,
      filePath: file.path,
    })

    const { body, title } = payload as UndoPartial<NewPost>

    const created = await prisma.post.create({
      data: {
        body,
        title,
        media,
        createdById: reqUser.id,
      },
    })

    if (file) removeFile(file.path)

    return response.status(201).json(ApiReturn({ data: created }))
  } catch (error) {
    if (file) removeFile(file.path)
    return response
      .status(500)
      .json(ApiReturn({ message: (error as Error).message }))
  }
}
