import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ClassSetting } from './class-setting.entity'
import { ClassSettingService } from './class-setting.service'

@Module({
  imports: [TypeOrmModule.forFeature([ClassSetting])],
  providers: [ClassSettingService],
  exports: [ClassSettingService],
})
export class ClassSettingModule {}
