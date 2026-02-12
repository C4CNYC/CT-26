import { Module } from '@nestjs/common'

import { StudentCoursesManagerModule } from '@/modules/managers/student-manager/courses-student-manager/courses-student-manager.module'
import { WorkspaceManagerModule } from '@/modules/managers/workspace-manager/workspace-manager.module'

import { WorkspacePublicApiController } from './workspace-public-api.controller.api'

@Module({
  imports: [WorkspaceManagerModule, StudentCoursesManagerModule],
  controllers: [WorkspacePublicApiController],
})
export class WorkspacePublicApiModule {}
