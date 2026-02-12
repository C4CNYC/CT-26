import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ClassStudentPending } from './class-student-pending.entity'
import { ClassStudentPendingService } from './class-student-pending.service'

@Module({
  imports: [TypeOrmModule.forFeature([ClassStudentPending])],
  providers: [ClassStudentPendingService],
  exports: [ClassStudentPendingService],
})
export class ClassStudentPendingModule {}
