import { Module } from '@nestjs/common'

import { LessonContentFileModule } from '@/modules/core/lesson-content-file/lesson-content-file.module'

import { LessonContentModule } from '../../core/lesson-content/lesson-content.module'
import { LessonModule } from '../../core/lesson/lesson.module'
import { LessonContentManagerService } from './lesson-content-manager.service'

@Module({
  imports: [LessonModule, LessonContentModule, LessonContentFileModule],
  exports: [LessonContentManagerService],
  providers: [LessonContentManagerService],
})
export class LessonContentManagerModule {}
