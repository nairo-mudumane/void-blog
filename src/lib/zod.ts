import { ZodError } from 'zod'

function throwZodError(error: unknown): void {
  let message = (error as Error).message

  if (error instanceof ZodError) {
    const { code, message: zodMessage } = error.errors[0]
    message = `${code.toUpperCase()}: ${zodMessage}`
  }

  throw new Error(message)
}

export { throwZodError }
