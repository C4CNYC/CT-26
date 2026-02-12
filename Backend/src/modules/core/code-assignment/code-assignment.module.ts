import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CodeAssignment } from './code-assignment.entity'
import { CodeAssignmentService } from './code-assignment.service'

@Module({
  imports: [TypeOrmModule.forFeature([CodeAssignment])],
  providers: [CodeAssignmentService],
  exports: [CodeAssignmentService],
})
export class CodeAssignmentModule {}
