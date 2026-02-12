import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateProjectDto {
  @ApiPropertyOptional({
    type: 'string',
    description: 'Tile',
    example: 'Home Page',
  })
  @IsString()
  @IsOptional()
  readonly title?: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Description',
    example: 'any description',
  })
  @IsString()
  @IsOptional()
  readonly description?: string

  @ApiProperty({
    type: 'string',
    description: 'Body',
    example: {},
  })
  @IsString()
  body: Record<string, unknown>

  @ApiPropertyOptional({
    type: 'boolean',
    description: 'Make Project Publi OR Private',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly public?: boolean

  @ApiPropertyOptional({
    type: 'string',
    description: 'Language',
    example: 'html',
  })
  @IsString()
  @IsOptional()
  readonly language?: string
}
