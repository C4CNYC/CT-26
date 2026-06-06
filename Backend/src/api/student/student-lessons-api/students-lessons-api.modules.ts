import { Module } from '@nestjs/common'

import { CourseUnitModule } from '../../../modules/core/course-unit/course-unit.module'
import { CourseModule } from '../../../modules/core/course/course.module'
import { StudentModule } from '../../../modules/core/student/student.module'
import { LessonManagerModule } from '../../../modules/managers/lesson-manager/lesson-manager.module'
import { SchoolMangerModule } from '../../../modules/managers/school-manager/school-manager.module'
import { SchoolStudentsManagerModule } from '../../../modules/managers/school-students-manager/school-students-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { SchoolStudentManagerApiService } from '../../manager/school-student-manager-api/school-student-manager-api.service'
import { StudentModulesApiController } from './students-lessons-api.controller'
import { StudentLessonsApiService } from './students-lessons-api.services'

@Module({
  imports: [
    LessonManagerModule,
    SchoolStudentsManagerModule,
    SchoolMangerModule,
    S3Module,
    StudentModule,
    CourseModule,
    CourseUnitModule,
  ],
  providers: [StudentLessonsApiService, SchoolStudentManagerApiService],
  controllers: [StudentModulesApiController],
})
export class StudentLessonsApiModule {}
