import { IsString, IsUUID } from 'class-validator'

export class ExportLessonDto {
  @IsUUID()
  @IsString()
  lessonId: string
}