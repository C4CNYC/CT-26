import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateClassDto {
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
    example: 'Any description for class | tribe',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    type: 'string',
    description: 'Cover',
    example: '#ffff',
  })
  @IsString()
  cover: string
}
