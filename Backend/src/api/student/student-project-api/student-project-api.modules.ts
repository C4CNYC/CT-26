import { Module } from '@nestjs/common'

import { StudentModule } from '../../../modules/core/student/student.module'
import { StudentProjectManagerModule } from '../../../modules/managers/student-project-manager/student-project-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { StudenProjectApiController } from './student-project-api.controller'
import { StudentProjectApiService } from './student-project-api.services'

@Module({
  imports: [StudentProjectManagerModule, StudentModule, S3Module],
  providers: [StudentProjectApiService],
  controllers: [StudenProjectApiController],
})
export class StudentProjectApiModule {}
