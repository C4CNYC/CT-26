import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { LessonContentThreadDiscussion } from './lesson-content-thread-discussion.entity'

@Injectable()
export class LessonContentThreadDiscussionService extends BaseService<LessonContentThreadDiscussion> {
  constructor(
    @InjectRepository(LessonContentThreadDiscussion)
    public repository: Repository<LessonContentThreadDiscussion>,
  ) {
    super(LessonContentThreadDiscussion, repository)
  }
}
