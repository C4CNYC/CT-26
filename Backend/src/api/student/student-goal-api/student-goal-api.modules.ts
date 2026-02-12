import { Module } from '@nestjs/common'

import { StudentGoalModule } from '../../../modules/core/student-goal/student-goal.module'
import { StudentModule } from '../../../modules/core/student/student.module'
import { StudenGoalApiController } from './student-goal-api.controller'
import { StudentGoalApiService } from './student-goal-api.services'

@Module({
  imports: [StudentGoalModule, StudentModule],
  providers: [StudentGoalApiService],
  controllers: [StudenGoalApiController],
})
export class StudentGoalApiModule {}
