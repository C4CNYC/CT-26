import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Class } from './class.entity'
import { ClassService } from './class.service'

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
