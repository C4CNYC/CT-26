import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import googleAuthConfig from '@/config/google-auth.config'

import { GoogleClassesService } from './google-classes.service'

@Module({
  imports: [ConfigModule.forRoot({ load: [googleAuthConfig] })],
  controllers: [],
  providers: [GoogleClassesService],
  exports: [GoogleClassesService],
})
export class GoogleClassesModule {}
