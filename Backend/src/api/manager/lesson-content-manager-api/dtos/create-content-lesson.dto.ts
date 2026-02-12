import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsJSON,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { LessonContentComplexity } from '../../../../modules/core/lesson-content/enums/lesson-content-complexity.enums'
import { LessonContentType } from '../../../../modules/core/lesson-content/enums/lesson-content-type.enums'

export class CreateLessonContentDto {
  @ApiProperty({
    type: 'string', // Changed from 'enum' to 'string'
    description: 'Lesson type. Common values: editable, slides, code, tinymce, but any string is allowed',
    example: LessonContentType.Editable,
    default: LessonContentType.Editable,
  })
  @IsString()
  @IsOptional()
  type: string // Changed from LessonContentType to string

  @ApiProperty({
    type: 'string',
    description: 'slug',
    example: 'js-example-condition',
  })
  @IsOptional()
  @IsString()
  slug: string

  @ApiProperty({
    type: 'string',
    description: 'Title',
    example: 'javascript example lesson',
  })
  @IsString()
  title: string

  @ApiProperty({
    type: 'string',
    description: 'Validation',
    example: 'any regex vaildaton',
  })
  @IsString()
  @IsOptional()
  validation: string

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: 'best lesson content ever',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    type: 'string',
    description: 'Preload Body',
    example: 'const sum = (a,b) => a + b',
  })
  @IsString()
  @IsOptional()
  preload_body: string

  @ApiProperty({
    type: 'string',
    description: 'Tips',
    example: 'string',
  })
  @IsString()
  @IsOptional()
  tips: string

  @ApiProperty({
    type: 'string',
    description: 'Solution Body',
    example: 'const sum = (a,b) => a + b',
  })
  @IsString()
  @IsOptional()
  solution_body: string

  @ApiProperty({
    type: 'string',
    description: 'Active',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  active: boolean

  @ApiProperty({
    type: 'string',
    description: 'Draft',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  draft: boolean

  @ApiProperty({
    type: 'string',
    description: 'here we can set anythink abou custom theme',
    example: { order: '0.1' },
  })
  @IsObject()
  @IsOptional()
  meta: { [key: string]: string | number }

  @ApiProperty({
    type: 'string',
    description: 'Tags',
    example: ['HTML', 'CSS'],
  })
  @IsOptional()
  @IsArray()
  tags: string[]

  @ApiProperty({
    type: 'enum',
    enum: LessonContentComplexity,
    description: 'Complexity',
    example: LessonContentComplexity.Beginner,
  })
  @IsString()
  @IsOptional()
  complexity: LessonContentComplexity

  @ApiProperty({
    type: 'string',
    description: 'Body',
    example: {},
  })
  @IsOptional()
  @IsJSON()
  body: Record<string, unknown>
}
