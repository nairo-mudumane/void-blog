import { ENV } from '@/lib/zod'
import jwt, { SignOptions, VerifyErrors } from 'jsonwebtoken'

type IGetJWTPayload = { [key: string]: string | number }

type IVerifyCallback = (
  err: VerifyErrors | null,
  decoded: IGetJWTPayload | null,
) => void

function get(data: IGetJWTPayload, options?: SignOptions): string {
  const token = jwt.sign(data, ENV.JWT_SECRET!, { ...options })
  return token
}

function verify(token: string, callback: IVerifyCallback): void {
  jwt.verify(token, ENV.JWT_SECRET!, (err, decoded) => {
    if (err) callback(err, null)
    else callback(null, decoded as IGetJWTPayload)
  })
}

export default { get, verify }
