import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import unsplashConfig from '@/config/unsplash.config'

import { UnsplashController } from './unsplash.controller'
import { UnsplashService } from './unsplash.service'

@Module({
  imports: [ConfigModule.forRoot({ load: [unsplashConfig] })],
  controllers: [UnsplashController],
  providers: [UnsplashService],
  exports: [UnsplashService],
})
export class UnsplashModule {}
