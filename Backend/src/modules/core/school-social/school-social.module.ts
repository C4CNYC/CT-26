import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SchoolSocialService } from './school-sochial.service'
import { SchoolSocial } from './school-social.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SchoolSocial])],
  providers: [SchoolSocialService],
  exports: [SchoolSocialService],
})
export class SchoolSocialModule {}
