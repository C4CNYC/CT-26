import { Module } from '@nestjs/common'

import { SchoolModule } from '@/modules/core/school/school.module'
import { UserModule } from '@/modules/core/user/user.module'

import { CourseProgressModule } from '../../core/course-progress/course-progress.module'
import { CourseUnitModule } from '../../core/course-unit/course-unit.module'
import { CourseModule } from '../../core/course/course.module'
import { CourseUnitManagerService } from './course-unit-manager.service'

@Module({
  imports: [
    CourseUnitModule,
    UserModule,
    CourseModule,
    SchoolModule,
    CourseProgressModule,
  ],
  exports: [CourseUnitManagerService],
  providers: [CourseUnitManagerService],
})
export class CourseUnitManagerModule {}
