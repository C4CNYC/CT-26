import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { LessonToCourseUnit } from './lesson-to-course-unit.entity'

@Injectable()
export class LessonToCourseUnitService extends BaseService<LessonToCourseUnit> {
  constructor(
    @InjectRepository(LessonToCourseUnit)
    public repository: Repository<LessonToCourseUnit>,
  ) {
    super(LessonToCourseUnit, repository)
  }
}
