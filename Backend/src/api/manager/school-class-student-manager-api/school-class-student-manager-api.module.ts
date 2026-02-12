import { Module } from '@nestjs/common'

import { SchoolClassStudentsManagerModule } from '../../../modules/managers/school-class-students-manager/school-class-students-manager.module'
import { SchoolClassStudentManagerApiController } from './school-class-student-manager-api.controller'
import { SchoolClassStudentManagerApiService } from './school-class-student-manager-api.service'

@Module({
  imports: [SchoolClassStudentsManagerModule],
  providers: [SchoolClassStudentManagerApiService],
  controllers: [SchoolClassStudentManagerApiController],
})
export class SchoolClassStudentManagerApiModule {}
