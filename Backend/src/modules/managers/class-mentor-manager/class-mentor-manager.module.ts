import { Module } from '@nestjs/common'

import { ClassModule } from '../../core/class/class.module'
import { UserModule } from '../../core/user/user.module'
import { ClassMentorManagerService } from './class-mentor-manager.service'

@Module({
  imports: [ClassModule, UserModule],
  exports: [ClassMentorManagerService],
  providers: [ClassMentorManagerService],
})
export class ClassMentorManagerModule {}
