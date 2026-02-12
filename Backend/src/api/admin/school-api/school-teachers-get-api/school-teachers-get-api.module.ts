import { Module } from '@nestjs/common'

import { SchoolMangerModule } from '../../../../modules/managers/school-manager/school-manager.module'
import { SchoolTeachersGetApiController } from './school-teachers-get-api.controller'
import { SchoolTeachersGetApiService } from './school-teachers-get-api.service'

@Module({
  imports: [SchoolMangerModule],
  providers: [SchoolTeachersGetApiService],
  controllers: [SchoolTeachersGetApiController],
})
export class SchoolTeachersGetApiModule {}
