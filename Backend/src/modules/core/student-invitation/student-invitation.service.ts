import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { StudentInvitation } from './student-invitation.entity'

@Injectable()
export class StudentInvitationService extends BaseService<StudentInvitation> {
  constructor(
    @InjectRepository(StudentInvitation)
    public repository: Repository<StudentInvitation>,
  ) {
    super(StudentInvitation, repository)
  }
}
