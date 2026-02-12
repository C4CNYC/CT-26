import { Module } from '@nestjs/common'

import { SchoolSocialManagerModule } from '../../../modules/managers/school-social-manager/school-social-manager.module'
import { SchoolSocialManagerApiController } from './school-social-manager-api.controller'
import { SchoolSocialManagerApiService } from './school-social-manager-api.service'

@Module({
  imports: [SchoolSocialManagerModule],
  providers: [SchoolSocialManagerApiService],
  controllers: [SchoolSocialManagerApiController],
})
export class SchoolSocialManagerApiModule {}
