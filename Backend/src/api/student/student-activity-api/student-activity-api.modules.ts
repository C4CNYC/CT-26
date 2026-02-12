import { Module } from '@nestjs/common'

import { ActivityManagerModule } from '@/modules/managers/activity-manager/activity-manager.module'

import { StudenActivityApiController } from './student-activity-api.controller'

@Module({
  imports: [ActivityManagerModule],
  controllers: [StudenActivityApiController],
})
export class StudentActivityApiModule {}
