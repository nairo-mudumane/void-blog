import { z as zod } from 'zod'

const schema = zod.object({
  PORT: zod.string().min(4),
  KNOWN_ORIGINS: zod.string(),
  JWT_SECRET: zod.string().min(6),
})

export const ENV = schema.parse(process.env)
