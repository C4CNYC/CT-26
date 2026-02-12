import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { CourseRating } from './course-rating.entity'

@Injectable()
export class CourseRatingService extends BaseService<CourseRating> {
  constructor(
    @InjectRepository(CourseRating)
    public repository: Repository<CourseRating>,
  ) {
    super(CourseRating, repository)
  }
}
