import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonContentThread } from './lesson-content-thread.entity'
import { LessonContentThreadService } from './lesson-content-thread.service'

@Module({
  imports: [TypeOrmModule.forFeature([LessonContentThread])],
  providers: [LessonContentThreadService],
  exports: [LessonContentThreadService],
})
export class LessonContentThreadModule {}
