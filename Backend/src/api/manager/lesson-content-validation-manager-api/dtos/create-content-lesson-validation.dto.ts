import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateLessonContentValidationDto {
  @ApiProperty({
    type: 'string',
    description: 'Title',
    example: 'Check H1 Tag',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Regex',
    example: '<h1>[a-zA-Z]+</h1>',
  })
  @IsString()
  regex: string

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: 'Validates that content contains an H1 tag',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    type: 'string',
    description: 'Validation type',
    example: 'regex, console output, inputs, etc.',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string
}
