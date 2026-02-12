import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { LessonContentValidator } from './lesson-content-validator.entity'

@Injectable()
export class LessonContentValidatorService extends BaseService<LessonContentValidator> {
  constructor(
    @InjectRepository(LessonContentValidator)
    public repository: Repository<LessonContentValidator>,
  ) {
    super(LessonContentValidator, repository)
  }
}
