import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SchoolContact } from './school-contact.entity'
import { SchoolContactService } from './school-contact.service'

@Module({
  imports: [TypeOrmModule.forFeature([SchoolContact])],
  providers: [SchoolContactService],
  exports: [SchoolContactService],
})
export class SchoolContactModule {}
