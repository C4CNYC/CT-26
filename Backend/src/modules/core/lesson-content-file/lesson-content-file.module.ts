import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonContentFile } from './lesson-content-file.entity'
import { LessonContentFileService } from './lesson-content-file.service'

@Module({
  imports: [TypeOrmModule.forFeature([LessonContentFile])],
  providers: [LessonContentFileService],
  exports: [LessonContentFileService],
})
export class LessonContentFileModule {}
