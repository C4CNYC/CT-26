import { Module } from '@nestjs/common'

import { SchoolModule } from '@/modules/core/school/school.module'

import { CourseUnitModule } from '../../../modules/core/course-unit/course-unit.module'
import { UserModule } from '../../../modules/core/user/user.module'
import { ModuleAdminApiController } from './module-api.controller'
import { ModuleUnitAdminApiService } from './module-api.service'

@Module({
  imports: [CourseUnitModule, SchoolModule, UserModule],
  providers: [ModuleUnitAdminApiService],
  controllers: [ModuleAdminApiController],
})
export class ModuleApiModule {}
