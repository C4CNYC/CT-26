import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import googleAuthConfig from '@/config/google-auth.config'

import { GoogleAuthService } from './google-auth.service'

@Module({
  imports: [ConfigModule.forRoot({ load: [googleAuthConfig] }), HttpModule],
  controllers: [],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
