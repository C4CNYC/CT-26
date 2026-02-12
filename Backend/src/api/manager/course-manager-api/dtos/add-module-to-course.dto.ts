import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddModuleToCourseDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'JavaScript',
  })
  @IsString()
  unit_id: string
}
