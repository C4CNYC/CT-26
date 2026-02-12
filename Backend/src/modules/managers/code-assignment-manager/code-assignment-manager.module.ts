import { Module } from '@nestjs/common'

import { CodeAssignmentModule } from '../../core/code-assignment/code-assignment.module'
import { CodeAssignmentManagerService } from './code-assignment-manager.service'

@Module({
  imports: [CodeAssignmentModule],
  providers: [CodeAssignmentManagerService],
  exports: [CodeAssignmentManagerService],
})
export class CodeAssignmentManagerModule {}
