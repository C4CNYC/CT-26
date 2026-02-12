import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CatalogCourseModule } from '../catalog-course/catalog-course.module'
import { CourseModule } from '../course/course.module'
import { UserModule } from '../user/user.module'
import { Organization } from './organization.entity'
import { OrganizationService } from './organization.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    CourseModule,
    CatalogCourseModule,
    UserModule,
  ],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
