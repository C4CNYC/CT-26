import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AuthorJoinCourseDto {
  @ApiProperty({
    type: 'string',
    description: 'Course ID',
    example: '',
  })
  @IsString()
  course_id: string
}
