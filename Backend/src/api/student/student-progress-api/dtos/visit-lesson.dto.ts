import { IsString } from 'class-validator'

export class VisitLessonDto {
  @IsString()
  lessonId: string

  @IsString()
  studentId: string
}
