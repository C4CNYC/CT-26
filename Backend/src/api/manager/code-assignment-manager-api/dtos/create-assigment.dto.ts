import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import {
  AssigmentTypes,
  AssignmentProjectCategories,
} from '../../../../modules/core/assigment/enums/assigment-type'

export class CreateAssigmentDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'Solve any task',
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
    description: "Class id's",
    example: '',
  })
  @IsArray()
  @IsOptional()
  classes: string[]

  @ApiProperty({
    type: 'array',
    description: "Skill id's",
    example: '',
  })
  @IsArray()
  @IsOptional()
  skill_tags: string[]

  @ApiProperty({
    type: 'array',
    description: "Student id's",
    example: '',
  })
  @IsArray()
  @IsOptional()
  students: string[]

  @ApiProperty({
    type: 'boolean',
    description: 'Active',
  })
  @IsBoolean()
  @IsOptional()
  active: boolean

  @ApiProperty({
    type: 'string',
    description: 'Course Unit Id',
  })
  @IsString()
  @IsOptional()
  courseUnitId: string

  @ApiProperty({
    enum: AssigmentTypes,
    description: 'type',
    example: AssigmentTypes.COURSE,
  })
  @IsOptional()
  @IsEnum(AssigmentTypes)
  type: AssigmentTypes

  @ApiProperty({
    enum: AssignmentProjectCategories,
    description: 'category',
    example: AssignmentProjectCategories.CREATIVE_PROJECT,
  })
  @IsOptional()
  @IsEnum(AssignmentProjectCategories)
  category: AssignmentProjectCategories

  @ApiProperty({
    type: 'string',
    description: 'Language',
    example: 'HTML/CSS',
  })
  @IsString()
  @IsOptional()
  language: string

  @ApiProperty({
    type: 'string',
    description: 'Lesson title',
    example: '',
  })
  @IsString()
  @IsOptional()
  lessonTitle: string

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: 'short info abouty assigment',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    type: 'string',
    description: 'Start Date',
    example: '2023-09-13T08:53:11.126Z',
  })
  @IsString()
  @IsOptional()
  start_date: string

  @ApiProperty({
    type: 'string',
    description: 'End Date',
    example: '2023-10-13T08:53:11.126Z',
  })
  @IsString()
  @IsOptional()
  end_date: string

  @ApiProperty({
    type: 'string',
    description: 'End Date',
    example: '2023-10-13T08:53:11.126Z',
  })
  @IsString()
  @IsOptional()
  close_date: string

  @ApiProperty({
    type: 'string',
    description: 'here we can set anythink abou custom theme',
    example: { order: 0.1 },
  })
  @IsObject()
  @IsOptional()
  meta: { [key: string]: string | number }

  @ApiProperty({
    type: 'string',
    description: 'LessonId Id',
  })
  @IsString()
  @IsOptional()
  lessonId: string
}
