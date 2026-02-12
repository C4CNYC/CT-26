import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'

import googleAuthConfig from '@/config/google-auth.config'

export interface IGoogleUserInfo {
  email: string
  email_verified: boolean
  family_name?: string
  given_name?: string
  locale?: string
  name?: string
  picture?: string
  sub: string
}

@Injectable()
export class GoogleAuthService {
  private oauthClient: OAuth2Client

  constructor(
    @Inject(googleAuthConfig.KEY)
    private readonly config: ConfigType<typeof googleAuthConfig>,
  ) {
    this.oauthClient = new OAuth2Client(config.clientId, config.clientSecret)
  }

  async authenticate(code: string): Promise<IGoogleUserInfo> {
    try {
      const { tokens } = await this.oauthClient.getToken({
        code,
        redirect_uri: 'postmessage',
      })

      if (!tokens.id_token) {
        throw new BadRequestException('No id_token returned from Google')
      }

      const ticket = await this.oauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.config.clientId,
      })

      const payload = ticket.getPayload()

      if (!payload?.email) {
        throw new BadRequestException('Invalid Google token payload')
      }

      return payload as IGoogleUserInfo
    } catch (e) {
      throw new BadRequestException('Google authentication failed')
    }
  }
}
