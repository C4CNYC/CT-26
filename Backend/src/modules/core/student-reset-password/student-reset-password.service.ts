import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { StudentResetPassword } from './student-reset-password.entity'

@Injectable()
export class StudentResetPasswordService extends BaseService<StudentResetPassword> {
  constructor(
    @InjectRepository(StudentResetPassword)
    public repository: Repository<StudentResetPassword>,
  ) {
    super(StudentResetPassword, repository)
  }
}
