import { z as zod, ZodError } from 'zod'

const schema = zod.object({
  PORT: zod.string().min(4),
  NODE_ENV: zod
    .enum(['development', 'production', 'staging'])
    .default('development'),
  KNOWN_ORIGINS: zod.string(),
  JWT_SECRET: zod.string().min(6),
  R2_ACCESS_KEY_ID: zod.string(),
  R2_SECRET_ACCESS_KEY: zod.string(),
  R2_ENDPOINT: zod.string().url(),
  R2_PUBLIC_ENDPOINT: zod.string().url(),
  R2_BUCKET_NAME: zod.string(),
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
