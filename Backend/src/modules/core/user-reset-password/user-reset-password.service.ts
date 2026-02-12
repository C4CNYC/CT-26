import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { UserResetPassword } from './user-reset-password.entity'

@Injectable()
export class UserResetPasswordService extends BaseService<UserResetPassword> {
  constructor(
    @InjectRepository(UserResetPassword)
    public repository: Repository<UserResetPassword>,
  ) {
    super(UserResetPassword, repository)
  }
}
