import { registerAs } from '@nestjs/config'

export interface GoogleAuthConfig {
  clientSecret: string
  clientId: string
  callbackUrl: string
}

export default registerAs('googleAuthConfig', () => {
  return {
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    callbackUrl: process.env.GOOGLE_AUTH_CALLBACK_URL,
  } as GoogleAuthConfig
})
