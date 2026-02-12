import { Module } from '@nestjs/common'

import { CourseAuthorModule } from '../../core/course-authors/course-authors.module'
import { CourseModule } from '../../core/course/course.module'
import { CourseAuthorManagerService } from './course-author-manager.service'

@Module({
  imports: [CourseModule, CourseAuthorModule],
  providers: [CourseAuthorManagerService],
  exports: [CourseAuthorManagerService],
})
export class CourseAuthorManagerModule {}
