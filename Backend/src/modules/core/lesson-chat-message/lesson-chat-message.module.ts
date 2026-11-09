import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonChatMessage } from './lesson-chat-message.entity'
import { LessonChatMessageService } from './lesson-chat-message.service'

@Module({
  imports: [TypeOrmModule.forFeature([LessonChatMessage])],
  providers: [LessonChatMessageService],
  exports: [LessonChatMessageService],
})
export class LessonChatMessageModule {}
