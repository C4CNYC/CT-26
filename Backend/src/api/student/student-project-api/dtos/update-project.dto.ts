import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsJSON, IsOptional, IsString } from 'class-validator'

export class UpdateProjectDto {
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

  @ApiPropertyOptional({
    type: 'string',
    description: 'Body',
    example: {},
  })
  @IsJSON()
  @IsOptional()
  body: Record<string, unknown>

  @ApiPropertyOptional({
    type: 'string',
    description: 'Language',
    example: 'html',
  })
  @IsOptional()
  @IsString()
  readonly language?: string

  @ApiPropertyOptional({
    type: 'boolean',
    description: 'Public',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly public?: boolean
}
