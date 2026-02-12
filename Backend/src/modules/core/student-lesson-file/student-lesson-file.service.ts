import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { StudentLessonFile } from './student-lesson-file.entity'

@Injectable()
export class StudentLessonFileService extends BaseService<StudentLessonFile> {
  constructor(
    @InjectRepository(StudentLessonFile)
    public repository: Repository<StudentLessonFile>,
  ) {
    super(StudentLessonFile, repository)
  }
}
