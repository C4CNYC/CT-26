import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { ClassSetting } from './class-setting.entity'

@Injectable()
export class ClassSettingService extends BaseService<ClassSetting> {
  constructor(
    @InjectRepository(ClassSetting)
    public repository: Repository<ClassSetting>,
  ) {
    super(ClassSetting, repository)
  }
}
