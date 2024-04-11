import { NewPostCategory, UndoPartial } from '@/@types'
import { ERROR_MESSAGES } from '@/config'
import { throwZodError } from '@/lib/zod'
import { z as zod } from 'zod'

export function create(
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
