import { Module } from '@nestjs/common'

import { SchoolMangerModule } from '../../../../modules/managers/school-manager/school-manager.module'
import { SchoolTeachersApiController } from './school-teachers-api.controller'
import { SchoolTeachersApiService } from './school-teachers-api.service'

@Module({
  imports: [SchoolMangerModule],
  providers: [SchoolTeachersApiService],
  controllers: [SchoolTeachersApiController],
})
export class SchoolTeachersApiModule {}
