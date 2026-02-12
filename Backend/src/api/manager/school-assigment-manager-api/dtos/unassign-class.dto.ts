import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UnassignCourseDto {
  @ApiProperty({
    type: 'string',
    description: 'course_id',
  })
  @IsString()
  course_id: string
}
