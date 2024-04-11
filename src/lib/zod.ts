import { z as zod, ZodError } from 'zod'

const schema = zod.object({
  PORT: zod.string().min(4),
  KNOWN_ORIGINS: zod.string(),
  JWT_SECRET: zod.string().min(6),
})

export const ENV = schema.parse(process.env)

export function throwZodError(error: unknown): void {
  let message = (error as Error).message

  if (error instanceof ZodError) {
    const { code, message: zodMessage } = error.errors[0]
    message = `${code.toUpperCase()}: ${zodMessage}`
  }

  throw new Error(message)
}
