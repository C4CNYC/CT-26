import { Module } from '@nestjs/common'

import { StudentModule } from '../../../modules/core/student/student.module'
import { ClassMentorManagerModule } from '../../../modules/managers/class-mentor-manager/class-mentor-manager.module'
import { StudentClassesManagerModule } from '../../../modules/managers/student-manager/classes-student-manager/classes-student-manager.module'
import { StudentClassesApiController } from './students-classes-api.controller'
import { StudentClassesApiService } from './students-classes-api.services'

@Module({
  imports: [
    StudentClassesManagerModule,
    ClassMentorManagerModule,
    StudentModule,
  ],
  providers: [StudentClassesApiService],
  controllers: [StudentClassesApiController],
})
export class StudentClassesApiModule {}
