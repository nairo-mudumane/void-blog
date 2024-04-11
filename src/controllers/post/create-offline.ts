import { AuthRequest, NewPost, Post, PostCategory, UndoPartial } from '@/@types'
import { removeFile } from '@/helpers'
import { ApiReturn } from '@/http/api-return'
import { prisma } from '@/lib/prisma'
import R2 from '@/lib/r2'
import { payloadHandler } from '@/payload-handler'
import { Response } from 'express'

export async function createOffline(request: AuthRequest, response: Response) {
  const { files } = request
  const reqUser = request.user
  const payload = request.body as NewPost[]

  try {
    if (!files || !Array.isArray(files)) throw new Error('files are required')
    if (!Array.isArray(payload)) throw new Error('payload must be a array')

    for (const index in payload) {
      if (!files[index])
        throw new Error(`[post ${index}]: banner do artigo é obrigatório`)
      const { title, categoryId } = payloadHandler.post.createPost(
        payload[index],
        {
          onError(error) {
            return `[post ${index}]: missing mandatory fields`
          },
        },
      )!

      let exists: PostCategory | Post | null = null
      exists = (await prisma.post.findFirst({ where: { title } })) as Post
      if (exists) throw new Error('artigo já cadastrado')

      exists = (await prisma.postCategory.findFirst({
        where: { id: categoryId },
      })) as PostCategory
      if (!exists)
        throw new Error(`[artigo em ${index}]: categoria não reconhecida`)

      try {
        const r2 = new R2()
        const media = await r2.upload({
          ContentType: files[index].mimetype,
          fileKey: files[index].filename,
          filePath: files[index].path,
        })

        const { body, title } = payload[index] as UndoPartial<NewPost>

        const created = await prisma.post.create({
          data: {
            body,
            title,
            media,
            createdById: reqUser.id,
          },
        })

        if (files[index]) removeFile(files[index].path)

        return response.status(201).json(ApiReturn({ data: created }))
      } catch (error) {
        if (files[index]) removeFile(files[index].path)
        return response
          .status(500)
          .json(ApiReturn({ message: (error as Error).message }))
      }
    }
  } catch (error) {
    return response
      .status(400)
      .json(ApiReturn({ message: (error as Error).message }))
  }
}
