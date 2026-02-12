import { Module } from '@nestjs/common'

import { CourseUnitAuthorModule } from '../../core/course-unit-authors/course-unit-authors.module'
import { CourseUnitModule } from '../../core/course-unit/course-unit.module'
import { CourseUnitAuthorManagerService } from './course-unit-author-manager.service'

@Module({
  imports: [CourseUnitModule, CourseUnitAuthorModule],
  providers: [CourseUnitAuthorManagerService],
  exports: [CourseUnitAuthorManagerService],
})
export class CourseUnitAuthorManagerModule {}
