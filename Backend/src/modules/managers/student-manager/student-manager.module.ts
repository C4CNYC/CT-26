import { Module } from '@nestjs/common'

import { StudentModule } from '../../core/student/student.module'
import { StudentManagerService } from './student-manager.service'

@Module({
  imports: [StudentModule],
  providers: [StudentManagerService],
  exports: [StudentManagerService],
})
export class StudentManagerModule {}
