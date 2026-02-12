import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

export class AddLessonToModuleDto {
  @ApiProperty({
    type: 'string',
    description: 'lesson id',
  })
  @IsUUID()
  lesson_id: string

  @ApiProperty({
    type: 'string',
    description: 'lesson sort',
  })
  @IsOptional()
  sort: string
}
