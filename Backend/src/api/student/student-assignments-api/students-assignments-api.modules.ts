import { Module } from '@nestjs/common'

import { StudentAssignmentsManagerModule } from '../../../modules/managers/student-manager/assignment-student-manager/assignment-student-manager.module'
import { StudentAssignmentsApiController } from './students-assignments-api.controller'
import { StudentAssignmentsApiService } from './students-assignments-api.services'

@Module({
  imports: [StudentAssignmentsManagerModule],
  providers: [StudentAssignmentsApiService],
  controllers: [StudentAssignmentsApiController],
})
export class StudentAssignmentsApiModule {}
