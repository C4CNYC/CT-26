import { Module } from '@nestjs/common'

import { CatalogCourseModule } from '@/modules/core/catalog-course/catalog-course.module'

import { CourseLikeModule } from '../../../core/course-like/course-like.module'
import { CourseRatingModule } from '../../../core/course-rating/course-rating.module'
import { CourseUnitModule } from '../../../core/course-unit/course-unit.module'
import { CourseModule } from '../../../core/course/course.module'
import { LessonModule } from '../../../core/lesson/lesson.module'
import { StudentModule } from '../../../core/student/student.module'
import { StudentCoursesManagerService } from './courses-student-manager.service'

@Module({
  imports: [
    CourseModule,
    StudentModule,
    CourseLikeModule,
    CourseUnitModule,
    CourseRatingModule,
    LessonModule,
    CatalogCourseModule,
  ],
  providers: [StudentCoursesManagerService],
  exports: [StudentCoursesManagerService],
})
export class StudentCoursesManagerModule {}
