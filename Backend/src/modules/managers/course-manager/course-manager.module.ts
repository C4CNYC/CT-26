import { Module } from '@nestjs/common'

import { CatalogCourseModule } from '@/modules/core/catalog-course/catalog-course.module'
import { OrganizationModule } from '@/modules/core/organization/organization.module'
import { SchoolModule } from '@/modules/core/school/school.module'
import { UserModule } from '@/modules/core/user/user.module'

import { CourseModule } from '../../core/course/course.module'
import { CourseManagerService } from './course-manager.service'

@Module({
  imports: [
    CourseModule,
    UserModule,
    SchoolModule,
    CatalogCourseModule,
    OrganizationModule,
  ],
  providers: [CourseManagerService],
  exports: [CourseManagerService],
})
export class CourseManagerModule {}
