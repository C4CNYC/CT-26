import { Module } from '@nestjs/common'

import { StudentProgressManagerModule } from '../../../modules/managers/student-progress-manager/student-progress-manager.module'
import { StudentProgressApiController } from './student-progress-api.controller'

@Module({
  imports: [StudentProgressManagerModule],
  controllers: [StudentProgressApiController],
})
export class StudentProgressApiModule {}
