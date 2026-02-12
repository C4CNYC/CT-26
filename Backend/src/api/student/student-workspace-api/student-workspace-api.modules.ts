import { Module } from '@nestjs/common'

import { WorkspaceManagerModule } from '@/modules/managers/workspace-manager/workspace-manager.module'

import { StudentWorkspaceApiController } from './student-workspace-api.controller'

@Module({
  imports: [WorkspaceManagerModule],
  controllers: [StudentWorkspaceApiController],
})
export class StudentWorkspaceApiModule {}
