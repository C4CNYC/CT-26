import { Module } from '@nestjs/common'

import { LessonContentFileModule } from '@/modules/core/lesson-content-file/lesson-content-file.module'
import { LessonContentThreadDiscussionReactionModule } from '@/modules/core/lesson-content-thread-discussion-reaction/lesson-content-thread-discussion-reaction.module'
import { LessonContentThreadDiscussionModule } from '@/modules/core/lesson-content-thread-discussion/lesson-content-thread-discussion.module'
import { LessonContentThreadModule } from '@/modules/core/lesson-content-thread/lesson-content-thread.module'
import { LessonContentModule } from '@/modules/core/lesson-content/lesson-content.module'
import { LessonModule } from '@/modules/core/lesson/lesson.module'
import { StudentLessonFileModule } from '@/modules/core/student-lesson-file/student-lesson-file.module'

import { StudentModule } from '../../core/student/student.module'
import { CourseProgressManagerModule } from '../course-progress-manager/course-progress-manager.module'
import { WorkspaceManagerService } from './workspace-manager.service'

@Module({
  imports: [
    LessonModule,
    StudentModule,
    LessonContentModule,
    StudentLessonFileModule,
    LessonContentFileModule,
    LessonContentThreadModule,
    CourseProgressManagerModule,
    LessonContentThreadDiscussionModule,
    LessonContentThreadDiscussionReactionModule,
  ],
  providers: [WorkspaceManagerService],
  exports: [WorkspaceManagerService],
})
export class WorkspaceManagerModule {}
