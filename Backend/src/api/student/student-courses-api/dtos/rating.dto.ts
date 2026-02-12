import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Max, Min } from 'class-validator'

export class CourseRatingDto {
  @ApiProperty({
    type: 'number',
    description: 'RATING',
    example: 3,
  })
  @IsInt()
  @Min(0)
  @Max(5)
  rating: number
}
