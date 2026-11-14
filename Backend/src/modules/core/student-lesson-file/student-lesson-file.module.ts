import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StudentLessonFile } from './student-lesson-file.entity'
import { StudentLessonFileService } from './student-lesson-file.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentLessonFile])],
  providers: [StudentLessonFileService],
  exports: [StudentLessonFileService],
})
export class StudentLessonFileModule {}
