import { Injectable } from '@nestjs/common'

import { LessonImportExportManagerService } from '@/modules/managers/lesson-import-export-manager/lesson-import-export-manager.service'

import { ExportLessonDto } from './export-lesson.dto'
import { LessonExportData } from '@/modules/managers/lesson-import-export-manager/interfaces/export.interface'

@Injectable()
export class LessonImportExportApiService {
  constructor(
    private lessonImportExportManagerService: LessonImportExportManagerService,
  ) {}

  async exportLesson(exportLessonDto: ExportLessonDto) {
    return await this.lessonImportExportManagerService.exportLesson(
      exportLessonDto.lessonId,
    )
  }

  async importLesson(userId:string, schoolId:string, file: Express.Multer.File) {
    const options = {
      overwriteExisting: false,
      generateNewSlugs: true,
      skipValidations: false,
    }
    return await this.lessonImportExportManagerService.importLesson(
      userId,
      schoolId,
      JSON.parse(file.buffer.toString()) as LessonExportData,
      options,
    )
  }

  async validateImportData(data: any) {
    return await this.lessonImportExportManagerService.validateImportData(data)
  }
}