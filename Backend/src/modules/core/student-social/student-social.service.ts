import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { StudentSocial } from './student-social.entity'

@Injectable()
export class StudentSocialService extends BaseService<StudentSocial> {
  constructor(
    @InjectRepository(StudentSocial)
    public repository: Repository<StudentSocial>,
  ) {
    super(StudentSocial, repository)
  }
}
