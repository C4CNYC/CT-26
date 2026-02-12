import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LoggerModule } from '@/logger/logger.module'

import { User } from './user.entity'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User]), LoggerModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
