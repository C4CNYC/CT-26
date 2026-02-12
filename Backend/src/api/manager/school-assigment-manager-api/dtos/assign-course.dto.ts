import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AssignCourseDto {
  @ApiProperty({
    type: 'string',
    description: 'course_id',
  })
  @IsString()
  course_id: string
}
