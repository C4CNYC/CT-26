import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateClassDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: 'Description',
  })
  @IsString()
  description: string

  @ApiProperty({
    type: 'string',
    description: 'Cover',
    example: '#ffff',
  })
  @IsString()
  cover: string
}
