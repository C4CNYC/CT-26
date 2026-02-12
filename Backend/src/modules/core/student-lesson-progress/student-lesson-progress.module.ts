import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonModule } from '../lesson/lesson.module'
import { StudentLessonProgress } from './student-lesson-progress.entity'
import { StudentLessonProgressService } from './student-lesson-progress.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentLessonProgress]), LessonModule],
  providers: [StudentLessonProgressService],
  exports: [StudentLessonProgressService],
})
export class StudentLessonProgressModule {}
