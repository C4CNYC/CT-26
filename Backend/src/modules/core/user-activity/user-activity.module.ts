import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LoggerModule } from '@/logger/logger.module'

import { UserActivity } from './user-activity.entity'
import { UserActivityService } from './user-activity.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserActivity]), LoggerModule],
  providers: [UserActivityService],
  exports: [UserActivityService],
})
export class UserActivityModule {}
