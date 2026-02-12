import { Module } from '@nestjs/common'

import { LessonContentFileModule } from '@/modules/core/lesson-content-file/lesson-content-file.module'
import { LessonContentValidatorModule } from '@/modules/core/lesson-content-validator/lesson-content-validator.module'
import { LessonContentModule } from '@/modules/core/lesson-content/lesson-content.module'
import { LessonModule } from '@/modules/core/lesson/lesson.module'
import { SchoolModule } from '@/modules/core/school/school.module'

import { LessonImportExportManagerService } from './lesson-import-export-manager.service'

@Module({
  imports: [
    LessonModule,
    LessonContentModule,
    LessonContentValidatorModule,
    LessonContentFileModule,
    SchoolModule,
  ],
  providers: [LessonImportExportManagerService],
  exports: [LessonImportExportManagerService],
})
export class LessonImportExportManagerModule {}