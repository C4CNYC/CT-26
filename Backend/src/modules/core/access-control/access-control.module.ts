import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccessControlEntity } from './access-control.entity'
import { AccessControlEntityService } from './access-control.service'

@Module({
  imports: [TypeOrmModule.forFeature([AccessControlEntity])],
  providers: [AccessControlEntityService],
  exports: [AccessControlEntityService],
})
export class AccessControlEntityModule {}
