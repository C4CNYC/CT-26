import { Module } from '@nestjs/common'

import { CourseApiModule } from './course-api/course-api.module'
import { LessonApiModule } from './lesson-api/lesson-api.module'
import { ModuleApiModule } from './module-api/module-api.module'
import { OrganizationApiModule } from './organization-api/organization-api.module'
import { PropertiesApiModule } from './properties/properties-api.module'
import { SchoolApiModule } from './school-api/school-api.module'
import { UserApiModule } from './user-api/user-api.module'

@Module({
  imports: [
    UserApiModule,
    SchoolApiModule,
    CourseApiModule,
    LessonApiModule,
    ModuleApiModule,
    PropertiesApiModule,
    OrganizationApiModule,
  ],
})
export class AdminApiModule {}
