import { ApiProperty } from '@nestjs/swagger'
import { IsJSON, IsString } from 'class-validator'

export class UpdateCodeAssignmentDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John',
  })
  @IsString()
  language: string

  @ApiProperty({
    type: 'string',
    description: 'Body',
    example: {},
  })
  @IsJSON()
  body: Record<string, unknown>
}
