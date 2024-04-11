import { ApiReturn } from '@/@types'

interface Config {
  remove?: string[]
}

export function ApiReturn(
  { message = 'ok', ...payload }: Partial<ApiReturn>,
  config?: Config,
): ApiReturn {
  if (config && config.remove && config.remove.length > 0)
    if (payload.data) {
      for (const key of Object.keys(payload.data)) {
        if (config.remove.includes(key)) payload.data[key] = undefined
      }
    }

  if (payload.data)
    if (Array.isArray(payload.data)) payload['count'] = payload.data.length

  return { message, ...payload }
}
