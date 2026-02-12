import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SchoolMangerModule } from '@/modules/managers/school-manager/school-manager.module'

import { UserModule } from '../user/user.module'
import { InviteSystem } from './invite-system.entity'
import { InviteSystemService } from './invite-system.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([InviteSystem]),
    UserModule,
    SchoolMangerModule,
  ],
  providers: [InviteSystemService],
  exports: [InviteSystemService],
})
export class InviteSystemModule {}
