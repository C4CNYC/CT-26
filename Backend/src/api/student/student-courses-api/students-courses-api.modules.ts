import { Module } from '@nestjs/common'

import { StudentCoursesManagerModule } from '../../../modules/managers/student-manager/courses-student-manager/courses-student-manager.module'
import { StudentCoursesApiController } from './students-courses-api.controller'
import { StudentCoursesApiService } from './students-courses-api.services'

@Module({
  imports: [StudentCoursesManagerModule],
  providers: [StudentCoursesApiService],
  controllers: [StudentCoursesApiController],
})
export class StudentCoursesApiModule {}
