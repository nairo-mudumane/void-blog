import bcrypt from 'bcrypt'

async function hash(data: string): Promise<string> {
  return await bcrypt.hash(data, 10)
}

async function compare(data: string, encrypted: string): Promise<boolean> {
  return await bcrypt.compare(data, encrypted)
}

export default { hash, compare }
