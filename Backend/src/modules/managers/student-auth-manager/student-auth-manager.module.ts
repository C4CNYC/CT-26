import { Module } from '@nestjs/common'

import { S3Module } from '../../../providers/s3/s3.module'
import { StudentModule } from '../../core/student/student.module'
import { UserModule } from '../../core/user/user.module'
import { StudentAuthManagerService } from './student-auth-manager.service'

@Module({
  imports: [StudentModule, S3Module, UserModule],
  providers: [StudentAuthManagerService],
  exports: [StudentAuthManagerService],
})
export class StudentAuthManagerModule {}
