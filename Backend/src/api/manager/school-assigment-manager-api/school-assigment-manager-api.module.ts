import { Module } from '@nestjs/common'

import { AssigmentManagerModule } from '../../../modules/managers/assigment-manager/assigment-manager.module'
import { AssignmentDetailsManagerModule } from '../../../modules/managers/assignment-details-manager/assignment-details-manager.module'
import { SchoolAssigmentManagerApiController } from './school-assigment-manager-api.controller'
import { SchoolAssigmentManagerApiService } from './school-assigment-manager-api.service'

@Module({
  imports: [AssigmentManagerModule, AssignmentDetailsManagerModule],
  providers: [SchoolAssigmentManagerApiService],
  controllers: [SchoolAssigmentManagerApiController],
})
export class SchoolAssigmentManagerApiModule {}
