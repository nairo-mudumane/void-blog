import { z as zod } from 'zod'

const schema = zod.object({
  PORT: zod.string().min(4),
  KNOWN_ORIGINS: zod.string(),
})

export const ENV = schema.parse(process.env)
