import { Module } from '@nestjs/common'

import { LessonContentFileModule } from '@/modules/core/lesson-content-file/lesson-content-file.module'
import { SchoolModule } from '@/modules/core/school/school.module'
import { UserModule } from '@/modules/core/user/user.module'
import { OpenAIModule } from '@/providers/openai/openai.module'

import { LessonModule } from '../../core/lesson/lesson.module'
import { CourseUnitLessonsManagerModule } from '../course-unit-lessons-manager/course-unit-lessons-manager.module'
import { LessonContentManagerModule } from '../lesson-content-manager/lesson-content-manager.module'
import { LessonDeepAssignModule } from '../lesson-deep-assign/lesson-deep-assign.module'
import { LessonManagerService } from './lesson-manager.service'
import { AIProvidersModule } from '@/providers/aiproviders/aiproviders.module'

@Module({
  imports: [
    LessonModule,
    LessonContentManagerModule,
    SchoolModule,
    LessonContentFileModule,
    UserModule,
    LessonDeepAssignModule,
    OpenAIModule,
    CourseUnitLessonsManagerModule,
    AIProvidersModule
  ],
  exports: [LessonManagerService],
  providers: [LessonManagerService],
})
export class LessonManagerModule {}
