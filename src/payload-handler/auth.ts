import { ERROR_MESSAGES } from '@/config'
import { throwZodError } from '@/lib/zod'
import { UndoPartial } from 'core'
import { NewUser } from 'user'
import { z as zod } from 'zod'

export function signup(
  payload: Partial<NewUser>,
): UndoPartial<NewUser | undefined> {
  try {
    const schema = zod.object(
      {
        email: zod
          .string({
            required_error: ERROR_MESSAGES.requiredEmail,
            invalid_type_error: ERROR_MESSAGES.invalidEmail,
          })
          .email(ERROR_MESSAGES.invalidEmail),
        name: zod
          .string({
            required_error: 'O nome é obrigatório',
            invalid_type_error: ERROR_MESSAGES.invalidName,
          })
          .min(3, ERROR_MESSAGES.invalidName),
        password: zod
          .string({
            required_error: ERROR_MESSAGES.invalidPassword,
            invalid_type_error: ERROR_MESSAGES.invalidPassword,
          })
          .min(4, ERROR_MESSAGES.invalidPassword),
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
