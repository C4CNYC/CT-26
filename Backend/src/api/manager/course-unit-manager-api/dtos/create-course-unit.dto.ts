import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { UnitAge } from '../../../../modules/core/course-unit/enums/unit-age.enum'
import { UnitGrading } from '../../../../modules/core/course-unit/enums/unit-grading.enum'
import { UnitLevel } from '../../../../modules/core/course-unit/enums/unit-level.enum'

export class CreateCourseUnitDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: 'best module ever',
  })
  @IsString()
  description: string

  @ApiProperty({
    type: 'string',
    description: 'Teacher Slides Link',
  })
  @IsString()
  @IsOptional()
  teacher_slides: string

  @ApiProperty({
    type: 'string',
    description: 'Module Lesson Plans Link',
  })
  @IsString()
  @IsOptional()
  lesson_plans: string

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string | null

  @ApiProperty({
    type: 'string',
    description: 'Teacher Forum Link',
  })
  @IsString()
  @IsOptional()
  teacher_forum: string

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
    enum: UnitLevel,
    description: 'Unit Level',
    example: UnitLevel.Beginner,
  })
  @IsEnum(UnitLevel)
  @IsOptional()
  level: UnitLevel

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
    enum: UnitAge,
    description: 'Unit Age',
    example: UnitAge.GRADE_1,
  })
  @IsEnum(UnitAge)
  @IsOptional()
  age: UnitAge

  @ApiProperty({
    type: 'string',
    description: 'Custom Age',
    example: '6-8',
  })
  @IsString()
  @IsOptional()
  customAge: string

  @ApiProperty({
    type: 'string',
    description: 'Brief',
    example: 'any text',
  })
  @IsString()
  @IsOptional()
  brief: string

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
    enum: UnitGrading,
    description: 'Course Age',
    example: UnitGrading.AUTO,
  })
  @IsEnum(UnitGrading)
  @IsOptional()
  grading: UnitGrading

  @ApiProperty({
    type: 'string',
    description: 'Sets any additional information into module',
    example: { order: '0.1', humanLang: 'English', machineLang: 'C++' },
  })
  @IsObject()
  @IsOptional()
  meta?: { [key: string]: string | number }
}
