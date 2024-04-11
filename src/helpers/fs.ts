import fs from 'fs'
import path from 'path'

export async function removeFile(filePath: string): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    try {
      filePath = path.resolve(filePath)
      return resolve(fs.unlinkSync(filePath))
    } catch (error) {
      reject(error)
    }
  })
}

export async function writeFile(
  filename: string,
  data: string | NodeJS.ArrayBufferView,
): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    try {
      filename = path.join(__dirname, '../../', filename)

      return resolve(
        fs.writeFile(filename, data, (err) => {
          if (err) throw err
          else return
        }),
      )
    } catch (error) {
      reject(error)
    }
  })
}

export function fromRootTo(pathTo: string): string {
  const result = path.resolve(path.join(__dirname, '../../', pathTo))
  return result
}

export function mkdir(path: string) {
  if (!fs.existsSync(path)) fs.mkdirSync(path)
}
