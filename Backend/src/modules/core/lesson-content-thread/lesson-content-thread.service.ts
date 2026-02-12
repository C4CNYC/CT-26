import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { LessonContentThread } from './lesson-content-thread.entity'

@Injectable()
export class LessonContentThreadService extends BaseService<LessonContentThread> {
  constructor(
    @InjectRepository(LessonContentThread)
    public repository: Repository<LessonContentThread>,
  ) {
    super(LessonContentThread, repository)
  }
}
