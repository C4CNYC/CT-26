import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { SchoolContact } from './school-contact.entity'

@Injectable()
export class SchoolContactService extends BaseService<SchoolContact> {
  constructor(
    @InjectRepository(SchoolContact)
    public repository: Repository<SchoolContact>,
  ) {
    super(SchoolContact, repository)
  }
}
