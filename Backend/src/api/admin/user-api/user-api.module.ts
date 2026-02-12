import { Module } from '@nestjs/common'

import { InvitationsMangerModule } from '../../../modules/managers/invitations-manager/invitations-manager.module'
import { SchoolMangerModule } from '../../../modules/managers/school-manager/school-manager.module'
import { UsersManagerModule } from '../../../modules/managers/users-manager/users-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { OrganizationUserApiController } from './user-api.controller'
import { UserApiService } from './user-api.service'

@Module({
  imports: [
    InvitationsMangerModule,
    SchoolMangerModule,
    UsersManagerModule,
    S3Module,
  ],
  providers: [UserApiService],
  controllers: [OrganizationUserApiController],
})
export class UserApiModule {}
