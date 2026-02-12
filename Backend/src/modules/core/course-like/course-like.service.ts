import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { CourseLike } from './course-like.entity'

@Injectable()
export class CourseLikeService extends BaseService<CourseLike> {
  constructor(
    @InjectRepository(CourseLike)
    public repository: Repository<CourseLike>,
  ) {
    super(CourseLike, repository)
  }
}
