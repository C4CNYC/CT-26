import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

import { CourseAge } from '../../../../modules/core/course/enums/course-age.enum'
import { CourseLevel } from '../../../../modules/core/course/enums/course-level.enum'

export class UpdateCoursetDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'JavaScript for befinner',
  })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'content_id',
    example: 'W1',
  })
  @IsString()
  @IsOptional()
  content_id: string

  @ApiProperty({
    type: 'string',
    description: 'userId',
    example: '',
  })
  @IsString()
  @IsOptional()
  userId: string

  @ApiProperty({
    type: 'string',
    enum: CourseLevel,
    description: 'Course Level',
    example: CourseLevel.Beginner,
  })
  @IsEnum(CourseLevel)
  @IsOptional()
  level: CourseLevel

  @ApiProperty({
    type: 'string',
    description: 'customLevel',
    example: 'your custom level',
  })
  @IsString()
  @IsOptional()
  customLevel: string

  @ApiProperty({
    type: 'string',
    enum: CourseAge,
    description: 'Course Age',
    example: CourseAge.GRADE_1,
  })
  @IsEnum(CourseAge)
  @IsOptional()
  age: CourseAge

  @ApiProperty({
    type: 'string',
    description: 'Custom Age',
    example: '6-8',
  })
  @IsString()
  @IsOptional()
  customAge: string

  @ApiProperty({
    type: 'number',
    description: 'Initial Enrolled Count',
    example: '10000',
  })
  @IsNumber()
  @IsOptional()
  initial_enrolled: number

  @ApiProperty({
    type: 'number',
    description: 'Initial Likes Count',
    example: '8000',
  })
  @IsNumber()
  @IsOptional()
  initial_likes: number

  @ApiProperty({
    type: 'number',
    description: 'Initial Stars Count',
    example: '8000',
  })
  @IsNumber()
  @IsOptional()
  initial_stars: number

  @ApiProperty({
    type: 'string',
    description: 'Price',
    example: '1200',
  })
  @IsString()
  @IsOptional()
  price: string

  @ApiProperty({
    type: 'string',
    description: 'Preview',
    example: '',
  })
  @IsString()
  @IsOptional()
  preview: string

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: 'Best course ever',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    type: 'boolean',
    description: 'active',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  active: boolean

  @ApiProperty({
    type: 'boolean',
    description: 'Draft',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  draft: boolean

  @ApiProperty({
    type: 'boolean',
    description: 'Public',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  public: boolean

  @ApiProperty({
    type: 'boolean',
    description: 'Catalog',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  catalog: boolean

  @ApiProperty({
    type: 'string',
    description: 'Audience',
    example: 'any text',
  })
  @IsString()
  @IsOptional()
  audience: string

  @ApiProperty({
    type: 'string',
    description: 'For Teachers',
    example: 'any text',
  })
  @IsString()
  @IsOptional()
  for_teachers: string

  @ApiProperty({
    type: 'boolean',
    description: 'Global',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  is_global: boolean
}
