import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import fs from 'fs'
import { ENV } from '../zod'
import { DeleteProps, UploadProps } from './@types'

export async function signedURL() {}

export default class R2 {
  private region = 'auto'
  private s3Client: S3Client

  constructor() {
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: ENV.R2_ENDPOINT,
      credentials: {
        accessKeyId: ENV.R2_ACCESS_KEY_ID,
        secretAccessKey: ENV.R2_SECRET_ACCESS_KEY,
      },
    })
  }

  public async upload({
    fileKey,
    ContentType,
    filePath,
  }: UploadProps): Promise<string> {
    try {
      const Body = fs.readFileSync(filePath)

      const command = new PutObjectCommand({
        Bucket: ENV.R2_BUCKET_NAME,
        Key: fileKey,
        ContentType,
        Body,
      })

      await this.s3Client.send(command)

      const url = `${ENV.R2_PUBLIC_ENDPOINT}/${fileKey}`

      return url
    } catch (error) {
      console.error(error)
      throw new Error((error as Error).message)
    }
  }

  public async delete({ fileUrl }: DeleteProps) {
    console.log({ 1: fileUrl })
    fileUrl = new URL(fileUrl).pathname.split('/').pop()!
    console.log({ 2: fileUrl })

    const command = new DeleteObjectCommand({
      Bucket: ENV.R2_BUCKET_NAME,
      Key: fileUrl,
    })

    const data = await this.s3Client.send(command)

    return data
  }
}
