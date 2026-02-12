import { Module } from '@nestjs/common'

import { ClassModule } from '@/modules/core/class/class.module'
import { UserActivityModule } from '@/modules/core/user-activity/user-activity.module'
import { UserModule } from '@/modules/core/user/user.module'

import { ActivityManagerService } from './activity-manager.service'

@Module({
  imports: [UserModule, UserActivityModule, ClassModule],
  providers: [ActivityManagerService],
  exports: [ActivityManagerService],
})
export class ActivityManagerModule {}
