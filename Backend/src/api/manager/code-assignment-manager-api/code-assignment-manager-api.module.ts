import { Module } from '@nestjs/common'

import { CodeAssignmentManagerModule } from '../../../modules/managers/code-assignment-manager/code-assignment-manager.module'
import { CodeAssignmentManagerApiController } from './code-assignment-manager-api.controller'
import { CodeAssignmentManagerApiService } from './code-assignment-manager-api.service'

@Module({
  imports: [CodeAssignmentManagerModule],
  providers: [CodeAssignmentManagerApiService],
  controllers: [CodeAssignmentManagerApiController],
})
export class CodeAssignmentManagerApiModule {}
