import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import sendgridConfig from '@/config/sendgrid.config'

import { SendgridModule } from '../../../providers/sendgrid/sendgrid.module'
import { EmailsManagerService } from './emails-manager.service'

@Module({
  imports: [SendgridModule, ConfigModule.forRoot({ load: [sendgridConfig] })],
  providers: [EmailsManagerService],
})
export class EmailsManagerModule {}
