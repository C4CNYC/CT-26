import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CourseAuthor } from './course-authors.entity'
import { CourseAuthorService } from './course-authors.service'

@Module({
  imports: [TypeOrmModule.forFeature([CourseAuthor])],
  providers: [CourseAuthorService],
  exports: [CourseAuthorService],
})
export class CourseAuthorModule {}
