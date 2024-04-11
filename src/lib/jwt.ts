import { JwtUser } from '@/@types'
import { JwtPayload, verify as _verify, sign } from 'jsonwebtoken'
import { ENV } from './zod'

function getToken(data: JwtUser): string {
  const now = new Date()
  now.setHours(now.getHours() + 23)

  const token = sign(data, ENV.JWT_SECRET, {
    expiresIn: 86400,
  })

  return token
}

function verify(token: string): JwtUser {
  const data = _verify(token, ENV.JWT_SECRET)
  const decoded = (data as JwtPayload).decoded

  return JSON.parse(decoded) as JwtUser
}

export default { getToken, verify }
