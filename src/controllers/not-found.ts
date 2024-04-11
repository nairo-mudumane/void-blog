import { ApiReturn } from '@/http/api-return'
import { Request, Response } from 'express'

export function NotFound(request: Request, response: Response) {
  const { method, path } = request
  return response
    .status(404)
    .json(ApiReturn({ message: `Can not ${method} ${path}` }))
}
