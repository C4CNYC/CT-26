import { Module } from '@nestjs/common'
import { AIProvidersService } from './aiproviders.service'
import { LogActivityManagerModule } from '@/api/manager/logactivity-manager/logactivity.module'

@Module({
  imports: [LogActivityManagerModule],
  providers: [AIProvidersService,],
  exports: [AIProvidersService],
})
export class AIProvidersModule { }
