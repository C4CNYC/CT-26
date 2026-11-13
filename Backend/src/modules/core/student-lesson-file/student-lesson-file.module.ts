import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StudentLessonFileJokesApiAddressFix } from './student-lesson-file-jokes-api-address.fix'
import { StudentLessonFile } from './student-lesson-file.entity'
import { StudentLessonFileService } from './student-lesson-file.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentLessonFile])],
  providers: [StudentLessonFileService, StudentLessonFileJokesApiAddressFix],
  exports: [StudentLessonFileService],
})
export class StudentLessonFileModule {}
