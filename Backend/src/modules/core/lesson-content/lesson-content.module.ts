import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonContent } from './lesson-content.entity'
import { LessonContentService } from './lesson-content.service'

@Module({
  imports: [TypeOrmModule.forFeature([LessonContent])],
  providers: [LessonContentService],
  exports: [LessonContentService],
})
export class LessonContentModule {}
