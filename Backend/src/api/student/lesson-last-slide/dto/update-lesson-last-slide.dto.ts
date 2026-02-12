import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

import { CreateLessonLastSlideDto } from './create-lesson-last-slide.dto'

export class UpdateLessonLastSlideDto extends PartialType(
  CreateLessonLastSlideDto,
) {
  @ApiProperty({
    type: 'number',
    description: 'Slide number',
    example: 1,
  })
  @IsNumber()
  slideNumber: number
}
