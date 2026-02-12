import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { LessonContentThreadDiscussionReaction } from './lesson-content-thread-discussion-reaction.entity'

@Injectable()
export class LessonContentThreadDiscussionReactionService extends BaseService<LessonContentThreadDiscussionReaction> {
  constructor(
    @InjectRepository(LessonContentThreadDiscussionReaction)
    public repository: Repository<LessonContentThreadDiscussionReaction>,
  ) {
    super(LessonContentThreadDiscussionReaction, repository)
  }
}
