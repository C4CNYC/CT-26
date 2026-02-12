import { Module } from '@nestjs/common'

import { StudentManagerModule } from '../../../modules/managers/student-manager/student-manager.module'
import { StudentClassmateApiController } from './student-classmate-api.controller'
import { StudentClassmateApiService } from './student-classmate-api.services'

@Module({
  imports: [StudentManagerModule],
  providers: [StudentClassmateApiService],
  controllers: [StudentClassmateApiController],
})
export class StudentClassmateApiModule {}
