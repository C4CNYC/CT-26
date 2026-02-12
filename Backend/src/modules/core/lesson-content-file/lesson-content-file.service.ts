import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { LessonContentFile } from './lesson-content-file.entity'

@Injectable()
export class LessonContentFileService extends BaseService<LessonContentFile> {
  constructor(
    @InjectRepository(LessonContentFile)
    public repository: Repository<LessonContentFile>,
  ) {
    super(LessonContentFile, repository)
  }
}
