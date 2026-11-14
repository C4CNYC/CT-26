import { forwardRef, Module } from '@nestjs/common'

import { OrganizationModule } from '@/modules/core/organization/organization.module'

import { ClassSettingModule } from '../../core/class-setting/class-setting.module'
import { ClassModule } from '../../core/class/class.module'
import { SchoolContactModule } from '../../core/school-contact/school-contact.module'
import { SchoolSettingModule } from '../../core/school-setting/school-setting.module'
import { SchoolModule } from '../../core/school/school.module'
import { UserModule } from '../../core/user/user.module'
import { SchoolMangerService } from './school-manager.service'
import { TeacherSchoolSetupService } from './teacher-school-setup.service'
import { InviteSystemModule } from '@/modules/core/invite-system/invite-system.module'
import { StudentModule } from '@/modules/core/student/student.module'
import { SchoolClassManagerModule } from '../school-class-manager/school-class-manager.module'
import { SchoolClassStudentsManagerModule } from '../school-class-students-manager/school-class-students-manager.module'

@Module({
  imports: [
    SchoolModule,
    ClassModule,
    UserModule,
    OrganizationModule,
    SchoolSettingModule,
    SchoolContactModule,
    ClassSettingModule,
    StudentModule,
    SchoolClassManagerModule,
    SchoolClassStudentsManagerModule,
    forwardRef(() => InviteSystemModule),
  ],
  exports: [SchoolMangerService, TeacherSchoolSetupService],
  providers: [SchoolMangerService, TeacherSchoolSetupService],
})
export class SchoolMangerModule {}
