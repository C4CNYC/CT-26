import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateIntegrationDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
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

  @ApiProperty({
    type: 'boolean',
    description: 'Public flag (only super-admin can modify)',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  public?: boolean
}