import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CourseUnit } from './course-unit.entity'
import { CourseUnitService } from './course-unit.service'
import { LessonToCourseUnit } from './lesson-to-course-unit.entity'
import { LessonToCourseUnitService } from './lesson-to-course-unit.service'

@Module({
  imports: [TypeOrmModule.forFeature([CourseUnit, LessonToCourseUnit])],
  providers: [CourseUnitService, LessonToCourseUnitService],
  exports: [CourseUnitService, LessonToCourseUnitService],
})
export class CourseUnitModule {}
