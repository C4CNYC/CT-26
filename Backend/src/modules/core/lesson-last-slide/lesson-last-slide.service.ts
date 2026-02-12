import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { LessonLastSlide } from '@/modules/core/lesson-last-slide/lesson-last-slide.entity'

import { BaseService } from '../../../utils/base/base.service'

@Injectable()
export class LessonLastSlideService extends BaseService<LessonLastSlide> {
  constructor(
    @InjectRepository(LessonLastSlide)
    public repository: Repository<LessonLastSlide>,
  ) {
    super(LessonLastSlide, repository)
  }
}
