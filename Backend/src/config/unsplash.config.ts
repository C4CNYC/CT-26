import { registerAs } from '@nestjs/config'

export interface UnsplashConfig {
  accessKey: string
}

export default registerAs('unsplashConfig', () => {
  return {
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
  } as UnsplashConfig
})
