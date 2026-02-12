import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class RemoveLessonFromModuleDto {
  @ApiProperty({
    type: 'string',
    description: 'lesson id',
  })
  @IsUUID()
  lesson_id: string
}
