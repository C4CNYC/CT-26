import { Module } from '@nestjs/common'

import { LessonImportExportManagerModule } from '@/modules/managers/lesson-import-export-manager/lesson-import-export-manager.module'

import { LessonImportExportApiController } from './lesson-import-export-api.controller'
import { LessonImportExportApiService } from './lesson-import-export-api.service'

@Module({
  imports: [LessonImportExportManagerModule],
  controllers: [LessonImportExportApiController],
  providers: [LessonImportExportApiService],
  exports: [LessonImportExportApiService],
})
export class LessonImportExportApiModule {}