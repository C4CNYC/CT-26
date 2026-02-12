import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { School } from './school.entity'
import { SchoolService } from './school.service'

@Module({
  imports: [TypeOrmModule.forFeature([School])],
  providers: [SchoolService],
  exports: [SchoolService],
})
export class SchoolModule {}
