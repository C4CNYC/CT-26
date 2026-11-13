import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StudentLessonFileRetiredJokeApiUrlFix } from './student-lesson-file-retired-joke-api-url.fix'
import { StudentLessonFile } from './student-lesson-file.entity'
import { StudentLessonFileService } from './student-lesson-file.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentLessonFile])],
  providers: [StudentLessonFileService, StudentLessonFileRetiredJokeApiUrlFix],
  exports: [StudentLessonFileService],
})
export class StudentLessonFileModule {}
