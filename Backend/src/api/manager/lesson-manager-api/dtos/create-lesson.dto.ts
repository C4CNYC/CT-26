import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { LessonType } from '../../../../modules/core/lesson/enums/lesson-type.enum'

export class CreateLessonDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Duration',
    example: 'Duration time in minutes',
  })
  @IsString()
  @IsOptional()
  duration: string

  @ApiProperty({
    type: 'array',
    description: 'Tips',
    example: ['foo', 'boo'],
  })
  @IsArray()
  @IsOptional()
  tips: string[]

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: 'best module ever',
  })
  @IsString()
  description: string

  @ApiProperty({
    type: 'boolean',
    description: 'Independent',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  independent: boolean

  @ApiProperty({
    type: 'boolean',
    description: 'active',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  active: boolean

  @ApiProperty({
    type: 'string',
    description: 'Type',
    example: LessonType.PRACTICAL,
  })
  @IsString()
  @IsOptional()
  type: LessonType

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
    description: 'The unique slug for the entity, derived from name.',
    example: 'unique-slug-for-lesson',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    value?.toLowerCase().replaceAll(/\W/g, '-').replaceAll(/-+/g, '-'),
  )
  slug: string

  @ApiProperty({
    type: 'string',
    description: 'Sets any additional information into lesson',
    example: { order: '0.1', humanLang: 'English', machineLang: 'C++' },
  })
  @IsObject()
  @IsOptional()
  meta?: { [key: string]: string | number }
}
