import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import sendgridConfig from '@/config/sendgrid.config'

import { SendgridService } from './sendgrid.service'

@Module({
  imports: [ConfigModule.forRoot({ load: [sendgridConfig] })],
  controllers: [],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}
