import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateSkillDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'HTML',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: '<link ....',
  })
  @IsString()
  description: string
}
