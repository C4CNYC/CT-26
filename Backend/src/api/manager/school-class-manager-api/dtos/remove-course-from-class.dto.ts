import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class RemoveCourseFromClassDto {
  @ApiProperty({
    type: 'string',
    description: 'course id',
    example: '',
  })
  @IsUUID()
  course_id: string
}
