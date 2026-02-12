import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ConsoleLoggerService } from '@/logger/console-logger.service'

import { BaseService } from '../../../utils/base/base.service'
import { UserActivity } from './user-activity.entity'

@Injectable()
export class UserActivityService extends BaseService<UserActivity> {
  constructor(
    private readonly logger: ConsoleLoggerService,
    @InjectRepository(UserActivity)
    public repository: Repository<UserActivity>,
  ) {
    super(UserActivity, repository)
    this.logger.setContext(UserActivityService.name)
  }
}
