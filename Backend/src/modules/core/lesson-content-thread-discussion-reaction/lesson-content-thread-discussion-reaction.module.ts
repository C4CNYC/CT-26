import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonContentThreadDiscussionReaction } from './lesson-content-thread-discussion-reaction.entity'
import { LessonContentThreadDiscussionReactionService } from './lesson-content-thread-discussion-reaction.service'

@Module({
  imports: [TypeOrmModule.forFeature([LessonContentThreadDiscussionReaction])],
  providers: [LessonContentThreadDiscussionReactionService],
  exports: [LessonContentThreadDiscussionReactionService],
})
export class LessonContentThreadDiscussionReactionModule {}
