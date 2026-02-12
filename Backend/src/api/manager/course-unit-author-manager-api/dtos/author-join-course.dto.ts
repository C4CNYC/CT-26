import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AuthorJoinCourseDto {
  @ApiProperty({
    type: 'string',
    description: 'Course Unit ID',
    example: '',
  })
  @IsString()
  course_unit_id: string
}
