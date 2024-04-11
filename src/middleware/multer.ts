import { fromRootTo } from '@/helpers/fs'
import { Request } from 'express'
import mime from 'mime-types'
import multer, { FileFilterCallback } from 'multer'
import { randomBytes } from 'node:crypto'

type Callback = (error: Error | null, filename: string) => void

const filename = (
  request: Request,
  file: Express.Multer.File,
  callback: Callback,
) => {
  const ext = mime.extension(file.mimetype)
  const randomStr = randomBytes(16).toString('hex')

  callback(null, `${file.fieldname}-${randomStr}.${ext}`)
}

const destination = (
  request: Request,
  file: Express.Multer.File,
  callback: Callback,
) => {
  callback(null, fromRootTo('.tmp/uploads'))
}

const storage = multer.diskStorage({ filename, destination })

const limits = {
  files: 1,
  fileSize: 1024 * 1024 * 10, // 10MB
}

const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
    callback(null, true)
  else callback(new Error("somente arquivos '.png' e '.jpeg' são aceitos"))
}

const imageUpload = multer({ storage, limits, fileFilter })

export { imageUpload }
