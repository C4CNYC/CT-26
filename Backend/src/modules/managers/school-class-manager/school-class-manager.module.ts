import { Module } from '@nestjs/common'

import { ClassSettingModule } from '../../core/class-setting/class-setting.module'
import { ClassModule } from '../../core/class/class.module'
import { SchoolModule } from '../../core/school/school.module'
import { CourseManagerModule } from '../course-manager/course-manager.module'
import { SchoolClassManagerService } from './school-class-manager.service'

@Module({
  imports: [SchoolModule, ClassModule, CourseManagerModule, ClassSettingModule],
  providers: [SchoolClassManagerService],
  exports: [SchoolClassManagerService],
})
export class SchoolClassManagerModule {}
