import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Assigment } from '@/modules/core/assigment/assigment.entity'
import { AssigmentModule } from '@/modules/core/assigment/assigment.module'
import { LessonContent } from '@/modules/core/lesson-content/lesson-content.entity'
import { LessonContentModule } from '@/modules/core/lesson-content/lesson-content.module'
import { Lesson } from '@/modules/core/lesson/lesson.entity'
import { LessonModule } from '@/modules/core/lesson/lesson.module'
import { SchoolModule } from '@/modules/core/school/school.module'
import { User } from '@/modules/core/user/user.entity'
import { UserModule } from '@/modules/core/user/user.module'

import { LessonDeepAssignService } from './lesson-deep-assign.service'
import { LessonContentFileModule } from '@/modules/core/lesson-content-file/lesson-content-file.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Assigment, Lesson, LessonContent, User]),
    AssigmentModule,
    LessonModule,
    LessonContentModule,
    LessonContentFileModule,
    UserModule,
    SchoolModule,
  ],
  exports: [LessonDeepAssignService],
  providers: [LessonDeepAssignService],
})
export class LessonDeepAssignModule {}
