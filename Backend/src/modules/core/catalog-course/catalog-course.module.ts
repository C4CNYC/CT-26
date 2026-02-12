import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CatalogCourse } from './catalog-course.entity'
import { CatalogCourseService } from './catalog-course.service'
import { CourseUnitModule } from '../course-unit/course-unit.module'
import { CourseUnit } from '../course-unit/course-unit.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CatalogCourse, CourseUnit]  )],
  providers: [CatalogCourseService],
  exports: [CatalogCourseService],
})
export class CatalogCourseModule {}
