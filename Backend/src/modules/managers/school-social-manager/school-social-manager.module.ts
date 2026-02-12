import { Module } from '@nestjs/common'

import { SchoolSocialModule } from '../../core/school-social/school-social.module'
import { SchoolModule } from '../../core/school/school.module'
import { SchoolSocialManagerService } from './school-social-manager.service'

@Module({
  imports: [SchoolModule, SchoolSocialModule],
  providers: [SchoolSocialManagerService],
  exports: [SchoolSocialManagerService],
})
export class SchoolSocialManagerModule {}
