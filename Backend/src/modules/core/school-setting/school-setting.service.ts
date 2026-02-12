import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { SchoolSetting } from './school-setting.entity'

@Injectable()
export class SchoolSettingService extends BaseService<SchoolSetting> {
  constructor(
    @InjectRepository(SchoolSetting)
    public repository: Repository<SchoolSetting>,
  ) {
    super(SchoolSetting, repository)
  }
}
