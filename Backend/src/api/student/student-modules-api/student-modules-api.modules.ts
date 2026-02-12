import { Module } from '@nestjs/common'

import { CourseUnitManagerModule } from '../../../modules/managers/course-unit-manager/course-unit-manager.module'
import { StudenModulesApiController } from './student-modules-api.controller'
import { StudentModulesApiService } from './student-modules-api.services'

@Module({
  imports: [CourseUnitManagerModule],
  providers: [StudentModulesApiService],
  controllers: [StudenModulesApiController],
})
export class StudentModulesApiModule {}
