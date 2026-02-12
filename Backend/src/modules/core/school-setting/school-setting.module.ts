import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SchoolSetting } from './school-setting.entity'
import { SchoolSettingService } from './school-setting.service'

@Module({
  imports: [TypeOrmModule.forFeature([SchoolSetting])],
  providers: [SchoolSettingService],
  exports: [SchoolSettingService],
})
export class SchoolSettingModule {}
