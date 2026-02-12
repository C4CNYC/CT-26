import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { SchoolSocial } from './school-social.entity'

@Injectable()
export class SchoolSocialService extends BaseService<SchoolSocial> {
  constructor(
    @InjectRepository(SchoolSocial)
    public repository: Repository<SchoolSocial>,
  ) {
    super(SchoolSocial, repository)
  }
}
