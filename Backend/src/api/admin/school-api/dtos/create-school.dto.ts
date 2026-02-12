import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { SchoolType } from '../../../../modules/core/school/enums/school-type.enum'
import { Country } from '../../../../utils/enums/countries.enum'

export class CreateSchoolDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John',
  })
  @IsString()
  name: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'City',
    example: 'Kiev',
  })
  @IsString()
  @IsOptional()
  city?: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Count code',
    example: 'ua',
  })
  @IsString()
  @IsOptional()
  country?: Country

  @ApiPropertyOptional({
    type: 'string',
    description: 'zip',
    example: '',
  })
  @IsString()
  @IsOptional()
  zip?: string

  @ApiPropertyOptional({
    type: 'enum',
    enum: SchoolType,
    description: 'type',
    example: SchoolType.Other,
  })
  @IsEnum(SchoolType)
  @IsOptional()
  type?: SchoolType
}
