import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { Invitation } from './invitation.entity'

@Injectable()
export class InvitationService extends BaseService<Invitation> {
  constructor(
    @InjectRepository(Invitation)
    public repository: Repository<Invitation>,
  ) {
    super(Invitation, repository)
  }
}
