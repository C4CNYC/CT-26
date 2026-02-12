import { Module } from '@nestjs/common'

import { CodeAssignmentManagerApiModule } from './code-assignment-manager-api/code-assignment-manager-api.module'
import { CourseAuthorManagerApiModule } from './course-author-manager-api/course-author-manager-api.module'
import { CourseManagerApiModule } from './course-manager-api/course-manager-api.module'
import { CourseProgressManagerApiModule } from './course-progress-manager-api/course-progress-manager-api.module'
import { CourseUnitAuthorManagerApiModule } from './course-unit-author-manager-api/course-unit-author-manager-api.module'
import { CourseUnitManagerApiModule } from './course-unit-manager-api/course-unit-manager-api.module'
import { EnvironmentsModule } from './environments/environments.module'
import { IntegrationManagerApiModule } from './integration-manager-api/integration-manager-api.module'
import { InviteSystemApiModule } from './invite-system-api/invite-system-api.module'
import { LessonContentManagerApiModule } from './lesson-content-manager-api/lesson-content-manager-api.module'
import { LessonContentValidationManagerApiModule } from './lesson-content-validation-manager-api/lesson-content-validation-manager-api.module'
import { LessonImportExportApiModule } from './lesson-import-export-api/lesson-import-export-api.module'
import { LessonManagerApiModule } from './lesson-manager-api/lesson-manager-api.module'
import { MediaManagerApiModule } from './media-manager-api/media-manager-api.module'
import { SchoolAssigmentManagerApiModule } from './school-assigment-manager-api/school-assigment-manager-api.module'
import { SchoolClassManagerApiModule } from './school-class-manager-api/school-class-manager-api.module'
import { SchoolClassStudentManagerApiModule } from './school-class-student-manager-api/school-class-student-manager-api.module'
import { SchoolManagerApiModule } from './school-manager-api/school-manager-api.module'
import { SchoolSocialManagerApiModule } from './school-social-manager-api/school-social-manager-api.module'
import { SchoolStudentManagerApiModule } from './school-student-manager-api/school-student-manager-api.module'
import { SkillManagerApiModule } from './skill-manager-api/skill-manager-api.module'
import { StatsModule } from './stats-manager-api/stats.module'

@Module({
  imports: [
    SchoolManagerApiModule,
    SchoolSocialManagerApiModule,
    SchoolClassManagerApiModule,
    SchoolStudentManagerApiModule,
    SchoolClassStudentManagerApiModule,
    SchoolAssigmentManagerApiModule,
    CourseManagerApiModule,
    CourseUnitManagerApiModule,
    CourseUnitAuthorManagerApiModule,
    LessonManagerApiModule,
    LessonContentManagerApiModule,
    LessonImportExportApiModule,
    CodeAssignmentManagerApiModule,
    LessonContentValidationManagerApiModule,
    IntegrationManagerApiModule,
    SkillManagerApiModule,
    CourseAuthorManagerApiModule,
    MediaManagerApiModule,
    CourseProgressManagerApiModule,
    StatsModule,
    EnvironmentsModule,
    InviteSystemApiModule,
  ],
})
export class ManagerApiModule {}
