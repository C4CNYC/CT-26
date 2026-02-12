import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Assigment } from './assigment.entity'
import { AssigmentService } from './assigment.service'

@Module({
  imports: [TypeOrmModule.forFeature([Assigment])],
  providers: [AssigmentService],
  exports: [AssigmentService],
})
export class AssigmentModule {}
