import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UnassignClassDto {
  @ApiProperty({
    type: 'string',
    description: 'class_id',
  })
  @IsString()
  class_id: string
}
