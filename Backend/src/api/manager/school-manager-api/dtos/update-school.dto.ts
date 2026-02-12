import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

import { SchoolType } from '../../../../modules/core/school/enums/school-type.enum'
import { Country } from '../../../../utils/enums/countries.enum'

export class UpdateSchoolDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'CodeTribe',
  })
  @IsString()
  @IsOptional()
  name: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'County',
    example: 'ua',
    enum: Country,
  })
  @IsEnum(Country)
  @IsOptional()
  country?: Country

  @ApiProperty({
    type: 'string',
    description: 'Address',
    example: '',
  })
  @IsString()
  @IsOptional()
  address: string

  @ApiProperty({
    type: 'string',
    description: 'City',
    example: '',
  })
  @IsString()
  @IsOptional()
  city: string

  @ApiProperty({
    type: 'string',
    description: 'About',
    example: '',
  })
  @IsString()
  @IsOptional()
  about: string

  @ApiProperty({
    type: 'string',
    description: 'Phone',
    example: '',
  })
  @IsString()
  @IsOptional()
  phone: string

  @ApiProperty({
    type: 'string',
    description: 'School active',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  active: boolean

  @ApiProperty({
    type: 'string',
    description: 'zip',
    example: '',
  })
  @IsString()
  @IsOptional()
  zip: string

  @ApiPropertyOptional({
    type: 'enum',
    enum: SchoolType,
    description: 'type',
    example: '',
  })
  @IsEnum(SchoolType)
  @IsOptional()
  type?: SchoolType
}
