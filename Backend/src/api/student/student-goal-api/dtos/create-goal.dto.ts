import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateGoalDto {
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
    description: 'Color',
    example: 'Home Page',
  })
  @IsString()
  @IsOptional()
  readonly color?: string
}
