import { Module } from '@nestjs/common'

import { ClassModule } from '../../../modules/core/class/class.module'
import { CourseModule } from '../../../modules/core/course/course.module'
import { LessonContentModule } from '../../../modules/core/lesson-content/lesson-content.module'
import { LessonModule } from '../../../modules/core/lesson/lesson.module'
import { StudentCoursesManagerModule } from '../../../modules/managers/student-manager/courses-student-manager/courses-student-manager.module'
import { StudentProjectManagerModule } from '../../../modules/managers/student-project-manager/student-project-manager.module'
import { StudentPublicApiController } from './student-public-api.controller'
import { StudentPublicApiService } from './student-public-api.services'

@Module({
  imports: [
    CourseModule,
    ClassModule,
    LessonModule,
    StudentCoursesManagerModule,
    LessonContentModule,
    StudentProjectManagerModule,
  ],
  providers: [StudentPublicApiService],
  controllers: [StudentPublicApiController],
})
export class StudentPublicApiModule {}
