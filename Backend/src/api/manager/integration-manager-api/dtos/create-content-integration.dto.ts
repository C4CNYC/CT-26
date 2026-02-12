import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateIntegrationDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Head',
    example: '<link ....',
  })
  @IsString()
  @IsOptional()
  head: string

  @ApiProperty({
    type: 'string',
    description: 'Script',
    example: '<script ....',
  })
  @IsString()
  @IsOptional()
  scripts: string
}
