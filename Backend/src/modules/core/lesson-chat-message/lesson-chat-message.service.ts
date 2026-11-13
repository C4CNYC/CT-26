import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { UIMessage } from 'ai'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { LessonChatMessage } from './lesson-chat-message.entity'

@Injectable()
export class LessonChatMessageService extends BaseService<LessonChatMessage> {
  constructor(
    @InjectRepository(LessonChatMessage)
    public repository: Repository<LessonChatMessage>,
  ) {
    super(LessonChatMessage, repository)
  }

  async findByLesson(lessonId: string): Promise<LessonChatMessage[]> {
    return await this.repository.find({
      where: { lessonId },
      order: { createdAt: 'ASC' },
    })
  }

  async append(
    lessonId: string,
    userId: string | null,
    message: UIMessage,
  ): Promise<LessonChatMessage> {
    return await this.create({ lessonId, userId, message })
  }
}
