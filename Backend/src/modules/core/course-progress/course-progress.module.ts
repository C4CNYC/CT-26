import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CourseProgress } from './course-progress.entity'
import { CourseProgressService } from './course-progress.service'

@Module({
  imports: [TypeOrmModule.forFeature([CourseProgress])],
  providers: [CourseProgressService],
  exports: [CourseProgressService],
})
export class CourseProgressModule {}
