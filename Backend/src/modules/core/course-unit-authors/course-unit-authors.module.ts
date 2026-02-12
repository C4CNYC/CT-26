import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CourseUnitAuthor } from './course-unit-authors.entity'
import { CourseUnitAuthorService } from './course-unit-authors.service'

@Module({
  imports: [TypeOrmModule.forFeature([CourseUnitAuthor])],
  providers: [CourseUnitAuthorService],
  exports: [CourseUnitAuthorService],
})
export class CourseUnitAuthorModule {}
