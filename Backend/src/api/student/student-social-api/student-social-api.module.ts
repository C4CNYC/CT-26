import { Module } from '@nestjs/common'

import { StudentSocialManagerModule } from '../../../modules/managers/student-social-manager/student-social-manager.module'
import { StudentSocialApiController } from './student-social-api.controller'
import { StudentSocialApiService } from './student-social-api.service'

@Module({
  imports: [StudentSocialManagerModule],
  providers: [StudentSocialApiService],
  controllers: [StudentSocialApiController],
})
export class StudentSocialApiModule {}
