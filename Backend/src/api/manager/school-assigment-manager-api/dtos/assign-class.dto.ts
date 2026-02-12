import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AssignClassDto {
  @ApiProperty({
    type: 'string',
    description: 'class_id',
  })
  @IsString()
  class_id: string
}
