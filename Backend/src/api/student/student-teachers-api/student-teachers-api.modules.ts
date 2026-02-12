import { Module } from '@nestjs/common'

import { UsersManagerModule } from '../../../modules/managers/users-manager/users-manager.module'
import { StudentTeachersApiController } from './student-teachers-api.controller'
import { StudentTeachersApiService } from './student-teachers-api.services'

@Module({
  imports: [UsersManagerModule],
  providers: [StudentTeachersApiService],
  controllers: [StudentTeachersApiController],
})
export class StudentTeachersApiModule {}
