import { Module } from '@nestjs/common'

import { SchoolTeachersGetApiModule } from '@/api/admin/school-api/school-teachers-get-api/school-teachers-get-api.module'

import { SchoolBaseApiModule } from './school-base-api/school-base-api.module'
import { SchoolClassesApiModule } from './school-classes-api/school-classes-api.module'
import { SchoolTeachersApiModule } from './school-teachers-api/school-teachers-api.module'

@Module({
  imports: [
    SchoolBaseApiModule,
    SchoolTeachersApiModule,
    SchoolClassesApiModule,
    SchoolTeachersGetApiModule,
  ],
})
export class SchoolApiModule {}
