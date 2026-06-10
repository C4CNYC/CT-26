import { registerAs } from '@nestjs/config'

export interface UnsplashConfig {
  accessKey: string
}

export default registerAs('unsplashConfig', () => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY env var is required')
  }
  return { accessKey } as UnsplashConfig
})
