import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { ClassStudentPending } from './class-student-pending.entity'

@Injectable()
export class ClassStudentPendingService extends BaseService<ClassStudentPending> {
  constructor(
    @InjectRepository(ClassStudentPending)
    public repository: Repository<ClassStudentPending>,
  ) {
    super(ClassStudentPending, repository)
  }
}
