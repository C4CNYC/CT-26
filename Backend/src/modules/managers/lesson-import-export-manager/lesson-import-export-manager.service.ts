import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { LessonContentFileService } from '@/modules/core/lesson-content-file/lesson-content-file.service'
import { LessonContentValidatorService } from '@/modules/core/lesson-content-validator/lesson-content-validator.service'
import { LessonContentService } from '@/modules/core/lesson-content/lesson-content.service'
import { LessonService } from '@/modules/core/lesson/lesson.service'

import {
  ExportedLesson,
  ExportedLessonContent,
  LessonExportData,
} from './interfaces/export.interface'
import { 
  ImportOptions,
  ImportValidationResult,
} from './interfaces/import.interface'
import { LessonContentType } from '@/modules/core/lesson-content/enums/lesson-content-type.enums'
import { LessonContentComplexity } from '@/modules/core/lesson-content/enums/lesson-content-complexity.enums'
import { LessonType } from '@/modules/core/lesson/enums/lesson-type.enum' 
import { Lesson } from '@/modules/core/lesson/lesson.entity'
import { SchoolService } from '@/modules/core/school/school.service'

@Injectable()
export class LessonImportExportManagerService {
  constructor(
    private lessonService: LessonService,
    private lessonContentService: LessonContentService,
    private lessonContentValidatorService: LessonContentValidatorService,
    private lessonContentFileService: LessonContentFileService,
    private dataSource: DataSource,
    private schoolService: SchoolService,
  ) {}

  async exportLesson(lessonId: string): Promise<LessonExportData> {
    const lesson = await this.lessonService.findOne({
      where: { id: lessonId },
      relations: {
        contents: {
          validations: true,
          files: true,
        },
      },
    })

    if (!lesson) {
      throw new Error('Lesson not found')
    }

    const exportedLesson: ExportedLesson = {
      id: lesson.id,
      active: lesson.active,
      draft: lesson.draft,
      name: lesson.name,
      auto_graded: lesson.auto_graded,
      core: lesson.core,
      type: lesson.type,
      description: lesson.description,
      head: lesson.head,
      tips: lesson.tips,
      duration: lesson.duration,
      independent: lesson.independent,
      slug: lesson.slug,
      meta: lesson.meta,
      contents: lesson.contents.map((content) => ({
        id: content.id,
        type: content.type,
        slug: content.slug,
        title: content.title,
        description: content.description,
        cover: content.cover,
        complexity: content.complexity,
        body: content.body,
        active: content.active,
        draft: content.draft,
        solution_body: content.solution_body,
        preload_body: content.preload_body,
        tips: content.tips,
        tags: content.tags,
        meta: content.meta,
        bg_color: content.bg_color,
        validations: content.validations.map((validation) => ({
          name: validation.name,
          regex: validation.regex,
          description: validation.description,
          type: validation.type,
        })),
        files: content.files.map((file) => ({
          name: file.name,
          extension: file.extension,
          connection_order: file.connection_order,
          preloaded_code: file.preloaded_code,
          editable: file.editable,
          hidden: file.hidden,
          active: file.active,
        })),
      })),
    }

    return {
      lesson: exportedLesson,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }
  }

  async validateImportData(data: any): Promise<ImportValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    if (!data.lesson) {
      errors.push('Missing lesson data')
    }

    if (!data.version) {
      warnings.push('Missing version information')
    }

    if (data.lesson) {
      if (!data.lesson.name) {
        errors.push('Lesson name is required')
      }

      if (!data.lesson.slug) {
        errors.push('Lesson slug is required')
      }

      if (data.lesson.contents) {
        data.lesson.contents.forEach((content: any, index: number) => {
          if (!content.title) {
            errors.push(`Content ${index + 1}: title is required`)
          }
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  async importLesson(
    userId: string,
    schoolId: string,
    data: LessonExportData,
    options: ImportOptions = {},
  ): Promise<Lesson> {
    const validation = await this.validateImportData(data)
    if (!validation.isValid) {
      throw new Error(`Invalid import data: ${validation.errors.join(', ')}`)
    }

    const idMapping = new Map<string, string>()

      return await this.dataSource.transaction(async (manager) => {
        const originalLessonId = data.lesson.id
        let newSlug = data.lesson.slug

        if (options.generateNewSlugs) {
          newSlug = `${data.lesson.slug}-${Date.now()}`
        }

        
      const school = await this.schoolService.findOne({
        where: { id: schoolId },
      })

        const lessonData = {
          active: data.lesson.active,
          draft: data.lesson.draft,
          name: data.lesson.name + ` (Imported)`,
          auto_graded: data.lesson.auto_graded,
          core: data.lesson.core,
          type: data.lesson.type,
          description: data.lesson.description,
          head: data.lesson.head,
          tips: data.lesson.tips,
          //duration: data.lesson.duration,
          independent: data.lesson.independent,
          slug: newSlug,
          meta: data.lesson.meta,
          // user: userId,
          userId,
          // contents: [],
          // assigments: [],
          // studentFiles: [],
          // authors: [],
          // units: [],
          school,
          // lessonToUnits: [],
          // last_slides: [],
          // skills: [],
          // integrations: [],
          // students: [],
          // id: '',
          // createdAt: '',
          // updatedAt: ''
        }

        const newLesson = await this.lessonService.create(lessonData)
        idMapping.set(originalLessonId, newLesson.id)

        for (const contentData of data.lesson.contents) {
          const originalContentId = contentData.id

          const newContent = await this.lessonContentService.create({
            type: contentData.type,
            slug: contentData.slug,
            title: contentData.title,
            description: contentData.description,
            cover: contentData.cover,
            complexity: contentData.complexity as LessonContentComplexity,
            body: contentData.body,
            active: contentData.active,
            draft: contentData.draft,
            solution_body: contentData.solution_body,
            preload_body: contentData.preload_body,
            tips: contentData.tips,
            tags: contentData.tags,
            meta: contentData.meta,
            bg_color: contentData.bg_color,
            lesson: newLesson,
          })

          idMapping.set(originalContentId, newContent.id)

          if (!options.skipValidations) {
            for (const validationData of contentData.validations) {
              await this.lessonContentValidatorService.create({
                name: validationData.name,
                regex: validationData.regex,
                description: validationData.description,
                type: validationData.type,
                lesson_content: newContent,
              })
            }
          }

          for (const fileData of contentData.files) {
            await this.lessonContentFileService.create({
              name: fileData.name,
              extension: fileData.extension,
              connection_order: fileData.connection_order,
              preloaded_code: fileData.preloaded_code,
              editable: fileData.editable,
              hidden: fileData.hidden,
              active: fileData.active,
              lessonContent: newContent,
            })
          }
        }

        return newLesson
      }) 
  }
}