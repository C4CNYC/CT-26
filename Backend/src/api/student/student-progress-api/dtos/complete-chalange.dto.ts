import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class ChompleteChalangeDTO {
  @ApiPropertyOptional({
    type: 'string',
    description: 'Lesson Content ID',
  })
  @IsOptional()
  @IsString()
  readonly lesson_content_id?: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Code',
  })
  @IsOptional()
  @IsString()
  readonly code?: string
}
