import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { LessonContentComplexity } from '../../../../modules/core/lesson-content/enums/lesson-content-complexity.enums'
import { LessonContentType } from '../../../../modules/core/lesson-content/enums/lesson-content-type.enums'

export class UpdateLessonContentDto {
  @ApiProperty({
    type: 'string', // Changed from 'enum' to 'string'
    description: 'Lesson type. Common values: editable, slides, code, tinymce, but any string is allowed',
    example: LessonContentType.Editable,
  })
  @IsString()
  @IsOptional()
  type: string // Changed from LessonContentType to string

  @ApiProperty({ type: 'string', description: 'slug' })
  @IsString()
  @IsOptional()
  slug: string

  @ApiProperty({ type: 'string', description: 'Title' })
  @IsString()
  @IsOptional()
  title: string

  @ApiProperty({ type: 'string', description: 'Description' })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({ type: 'string', description: 'Preload Body' })
  @IsString()
  @IsOptional()
  preload_body: string

  @ApiProperty({ type: 'string', description: 'Tips' })
  @IsString()
  @IsOptional()
  tips: string

  @ApiProperty({ type: 'string', description: 'Solution Body' })
  @IsString()
  @IsOptional()
  solution_body: string

  @ApiProperty({ type: 'string', description: 'Background Color' })
  @IsString()
  @IsOptional()
  bg_color: string

  @ApiProperty({ type: 'boolean', description: 'Active' })
  @IsBoolean()
  @IsOptional()
  active: boolean

  @ApiProperty({ type: 'boolean', description: 'Draft' })
  @IsBoolean()
  @IsOptional()
  draft: boolean

  @ApiProperty({ type: 'object', description: 'Custom meta data' })
  @IsObject()
  @IsOptional()
  meta: { [key: string]: string | number }

  @ApiProperty({ type: 'array', description: 'Tags' })
  @IsArray()
  @IsOptional()
  tags: string[]

  @ApiProperty({
    type: 'enum',
    enum: LessonContentComplexity,
    description: 'Complexity',
  })
  @IsString()
  @IsOptional()
  complexity: LessonContentComplexity

  @ApiProperty({ type: 'object', description: 'Body' })
  @IsString()
  @IsOptional()
  body: Record<string, unknown>
}
