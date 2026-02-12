import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StudentGoal } from './student-goal.entity'
import { StudentGoalService } from './student-goal.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentGoal])],
  providers: [StudentGoalService],
  exports: [StudentGoalService],
})
export class StudentGoalModule {}
