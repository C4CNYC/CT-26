import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonContentThreadDiscussion } from './lesson-content-thread-discussion.entity'
import { LessonContentThreadDiscussionService } from './lesson-content-thread-discussion.service'

@Module({
  imports: [TypeOrmModule.forFeature([LessonContentThreadDiscussion])],
  providers: [LessonContentThreadDiscussionService],
  exports: [LessonContentThreadDiscussionService],
})
export class LessonContentThreadDiscussionModule {}
