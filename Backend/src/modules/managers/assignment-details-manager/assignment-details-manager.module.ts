import { Module } from '@nestjs/common'

import { AssigmentModule } from '../../core/assigment/assigment.module'
import { ClassModule } from '../../core/class/class.module'
import { CodeAssignmentModule } from '../../core/code-assignment/code-assignment.module'
import { CourseModule } from '../../core/course/course.module'
import { LessonModule } from '../../core/lesson/lesson.module'
import { SkillModule } from '../../core/skills/skill.module'
import { StudentModule } from '../../core/student/student.module'
import { AssignmentDetailsManagerService } from './assignment-details-manager.service'

@Module({
  imports: [
    AssigmentModule,
    LessonModule,
    CodeAssignmentModule,
    ClassModule,
    StudentModule,
    CourseModule,
    SkillModule,
  ],
  providers: [AssignmentDetailsManagerService],
  exports: [AssignmentDetailsManagerService],
})
export class AssignmentDetailsManagerModule {}
