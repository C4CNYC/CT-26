import { Module } from '@nestjs/common'

import { StudentModule } from '../../../modules/core/student/student.module'
import { UserModule } from '../../../modules/core/user/user.module'
import { SchoolMangerModule } from '../../../modules/managers/school-manager/school-manager.module'
import { SchoolStudentsManagerModule } from '../../../modules/managers/school-students-manager/school-students-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { SchoolStudentManagerApiController } from './school-student-manager-api.controller'
import { SchoolStudentManagerApiService } from './school-student-manager-api.service'

@Module({
  imports: [SchoolStudentsManagerModule, S3Module, StudentModule, SchoolMangerModule, UserModule],
  providers: [SchoolStudentManagerApiService],
  controllers: [SchoolStudentManagerApiController],
})
export class SchoolStudentManagerApiModule {}
