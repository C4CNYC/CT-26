import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StudentProject } from './student-project.entity'
import { StudentProjectService } from './student-project.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentProject])],
  providers: [StudentProjectService],
  exports: [StudentProjectService],
})
export class StudentProjectModule {}
