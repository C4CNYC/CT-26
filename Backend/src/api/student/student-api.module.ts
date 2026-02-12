import { Module } from '@nestjs/common'

import { LessonLastSlideModule } from '@/api/student/lesson-last-slide/lesson-last-slide.module'

import { StudentActivityApiModule } from './student-activity-api/student-activity-api.modules'
import { StudentAssignmentsApiModule } from './student-assignments-api/students-assignments-api.modules'
import { StudentClassmateApiModule } from './student-classmate-api/student-classmate-api.modules'
import { StudentCoursesApiModule } from './student-courses-api/students-courses-api.modules'
import { StudentGoalApiModule } from './student-goal-api/student-goal-api.modules'
import { StudentLessonsApiModule } from './student-lessons-api/students-lessons-api.modules'
import { StudentModulesApiModule } from './student-modules-api/student-modules-api.modules'
import { StudentProgressApiModule } from './student-progress-api/student-progress-api.modules'
import { StudentProjectApiModule } from './student-project-api/student-project-api.modules'
import { StudentPublicApiModule } from './student-public-api/student-public-api.modules'
import { StudentSocialApiModule } from './student-social-api/student-social-api.module'
import { StudentWorkspaceApiModule } from './student-workspace-api/student-workspace-api.modules'
import { StudentClassesApiModule } from './students-classes-api/students-classes-api.modules'

@Module({
  imports: [
    StudentGoalApiModule,
    LessonLastSlideModule,
    StudentPublicApiModule,
    StudentSocialApiModule,
    StudentClassesApiModule,
    StudentCoursesApiModule,
    StudentModulesApiModule,
    StudentLessonsApiModule,
    StudentProjectApiModule,
    StudentProgressApiModule,
    StudentActivityApiModule,
    StudentClassmateApiModule,
    StudentWorkspaceApiModule,
    StudentAssignmentsApiModule,
  ],
})
export class StudentApiModule {}
