import { LessonType } from "@/modules/core/lesson/enums/lesson-type.enum"

export interface ExportedLessonContentValidator {
  name: string
  regex: string
  description: string
  type: string
}

export interface ExportedLessonContentFile {
  name: string
  extension: string
  connection_order: number
  preloaded_code: string
  editable: boolean
  hidden: boolean
  active: boolean
}

export interface ExportedLessonContent {
  id: string
  type: string
  slug: string
  title: string
  description: string
  cover: string
  complexity: string
  body: Record<string, unknown>
  active: boolean
  draft: boolean
  solution_body: string
  preload_body: string
  tips: string
  tags: string[]
  meta: Record<string, string | number>
  bg_color: string
  validations: ExportedLessonContentValidator[]
  files: ExportedLessonContentFile[]
}

export interface ExportedLesson {
  id: string
  active: boolean
  draft: boolean
  name: string
  auto_graded: boolean
  core: boolean
  type: LessonType
  description: string
  head: string
  tips: string[]
  duration: string
  independent: boolean
  slug: string
  meta: Record<string, string | number>
  contents: ExportedLessonContent[]
}

export interface LessonExportData {
  lesson: ExportedLesson
  exportedAt: string
  version: string
}