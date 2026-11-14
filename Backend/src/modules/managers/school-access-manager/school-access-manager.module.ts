import { Module } from '@nestjs/common'

import { SchoolModule } from '../../core/school/school.module'
import { UserModule } from '../../core/user/user.module'
import { SchoolAccessManagerService } from './school-access-manager.service'

@Module({
  imports: [UserModule, SchoolModule],
  providers: [SchoolAccessManagerService],
  exports: [SchoolAccessManagerService],
})
export class SchoolAccessManagerModule {}
