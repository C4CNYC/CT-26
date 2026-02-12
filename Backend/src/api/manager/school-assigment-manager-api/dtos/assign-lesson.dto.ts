import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AssignLessonDto {
  @ApiProperty({
    type: 'string',
    description: 'lesson_id',
  })
  @IsString()
  lesson_id: string
}
