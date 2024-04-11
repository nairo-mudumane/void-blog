import { NewPostCategory, UndoPartial } from '@/@types'
import { NewPost } from '@/@types/post'
import { ERROR_MESSAGES } from '@/config'
import { throwZodError } from '@/lib/zod'
import { z as zod } from 'zod'
import { PayloadHandlerConfig } from './@types'

export function createPost(payload: NewPost, config?: PayloadHandlerConfig) {
  try {
    const schema = zod.object(
      {
        title: zod.string({
          required_error: 'o título do artigo é obrigatório',
          invalid_type_error: 'o título do artigo deve ser um texto',
        }),
        body: zod.string({
          required_error: 'o corpo do artigo é obrigatório',
          invalid_type_error: 'o corpo do artigo deve ser um texto',
        }),
        categoryId: zod.string({
          required_error: 'o id da categoria do artigo é obrigatório',
          invalid_type_error: 'o id da categoria do artigo deve ser um texto',
        }),
      },
      {
        required_error: ERROR_MESSAGES.noPayloadProvided,
        invalid_type_error: ERROR_MESSAGES.noPayloadProvided,
      },
    )

    return schema.parse(payload)
  } catch (error) {
    if (config && config.onError) {
      const message = config.onError((error as Error).message)
      throw new Error(message)
    } else throwZodError(error)
  }
}

export function createPostCategory(
  payload: Partial<NewPostCategory>,
): UndoPartial<NewPostCategory | undefined> {
  try {
    const schema = zod.object(
      {
        label: zod
          .string({
            required_error: 'categoria é obrigatória',
            invalid_type_error:
              'ERROR_MESSAGES.invalidEmailcategoria deve ser um texto com minimo de 3 caracteres',
          })
          .min(3),
      },
      {
        required_error: ERROR_MESSAGES.noPayloadProvided,
        invalid_type_error: ERROR_MESSAGES.noPayloadProvided,
      },
    )

    return schema.parse(payload)
  } catch (error) {
    throwZodError(error)
  }
}
