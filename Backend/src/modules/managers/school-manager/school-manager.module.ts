import { Module } from '@nestjs/common'

import { OrganizationModule } from '@/modules/core/organization/organization.module'

import { ClassSettingModule } from '../../core/class-setting/class-setting.module'
import { ClassModule } from '../../core/class/class.module'
import { SchoolContactModule } from '../../core/school-contact/school-contact.module'
import { SchoolSettingModule } from '../../core/school-setting/school-setting.module'
import { SchoolModule } from '../../core/school/school.module'
import { UserModule } from '../../core/user/user.module'
import { SchoolMangerService } from './school-manager.service'

@Module({
  imports: [
    SchoolModule,
    ClassModule,
    UserModule,
    OrganizationModule,
    SchoolSettingModule,
    SchoolContactModule,
    ClassSettingModule,
  ],
  exports: [SchoolMangerService],
  providers: [SchoolMangerService],
})
export class SchoolMangerModule {}
