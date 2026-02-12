import { Module } from '@nestjs/common'

import { StudentProjectModule } from '../../core/student-project/student-project.module'
import { StudentProjectManagerService } from './student-project-manager.service'

@Module({
  imports: [StudentProjectModule],
  providers: [StudentProjectManagerService],
  exports: [StudentProjectManagerService],
})
export class StudentProjectManagerModule {}
