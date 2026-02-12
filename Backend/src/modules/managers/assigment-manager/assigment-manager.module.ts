import { Module } from '@nestjs/common'

import { LessonContentModule } from '@/modules/core/lesson-content/lesson-content.module'
import { LessonModule } from '@/modules/core/lesson/lesson.module'

import { AssigmentModule } from '../../core/assigment/assigment.module'
import { ClassModule } from '../../core/class/class.module'
import { CourseUnitModule } from '../../core/course-unit/course-unit.module'
import { SchoolModule } from '../../core/school/school.module'
import { SkillModule } from '../../core/skills/skill.module'
import { StudentModule } from '../../core/student/student.module'
import { AssigmentManagerService } from './assigment-manager.service'

@Module({
  imports: [
    AssigmentModule,
    SchoolModule,
    ClassModule,
    StudentModule,
    SkillModule,
    CourseUnitModule,
    LessonModule,
    LessonContentModule,
  ],
  providers: [AssigmentManagerService],
  exports: [AssigmentManagerService],
})
export class AssigmentManagerModule {}
