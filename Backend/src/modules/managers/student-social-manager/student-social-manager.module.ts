import { Module } from '@nestjs/common'

import { StudentSocialModule } from '../../core/student-social/student-social.module'
import { StudentModule } from '../../core/student/student.module'
import { StudentSocialManagerService } from './student-social-manager.service'

@Module({
  imports: [StudentModule, StudentSocialModule],
  providers: [StudentSocialManagerService],
  exports: [StudentSocialManagerService],
})
export class StudentSocialManagerModule {}
