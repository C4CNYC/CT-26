import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsUUID } from 'class-validator'

export class CreateLessonLastSlideDto {
  @ApiProperty({
    type: 'number',
    description: 'Slide number',
    example: 1,
  })
  @IsNumber()
  slideNumber: number

  @ApiProperty({
    type: 'uuid',
    description: 'Lesson id',
    example: '',
  })
  @IsUUID()
  lessonId: string
}
