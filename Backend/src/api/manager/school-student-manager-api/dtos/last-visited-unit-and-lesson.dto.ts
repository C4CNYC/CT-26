import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class LastVisitedUnitAndLessonDto {
  @ApiProperty({
    type: 'string',
    description: 'Last Visited Lesson Id',
    example: 'c63c909c-13fe-4cec-a326-bdcb0f5f8d7a',
  })
  @IsUUID()
  lessonId: string

  @ApiProperty({
    type: 'string',
    description: 'Last visited unit id',
    example: 'c63c909c-13fe-4cec-a326-bdcb0f5f8d7a',
  })
  @IsUUID()
  unitId: string

  @ApiProperty({
    type: 'string',
    description: 'Last visited course id',
    example: 'c63c909c-13fe-4cec-a326-bdcb0f5f8d7a',
  })
  @IsUUID()
  courseId: string
}
