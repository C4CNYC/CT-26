import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

import { Country } from '../../../../utils/enums/countries.enum'

export class UpdateStudentDto {
  @ApiProperty({
    type: 'string',
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  first_name: string

  @ApiProperty({
    type: 'string',
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  last_name: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Cover',
    example: '',
  })
  @IsOptional()
  cover?: string

  @ApiProperty({
    type: 'string',
    description: 'Phone',
    example: '+2807433295',
  })
  @IsString()
  @IsOptional()
  phone: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Country',
    example: 'ua',
    enum: Country,
  })
  @IsEnum(Country)
  @IsOptional()
  country?: Country

  @ApiProperty({
    type: 'string',
    description: 'State',
    example: '',
  })
  @IsString()
  @IsOptional()
  state: string

  @ApiProperty({
    type: 'string',
    description: 'City',
    example: 'Lviv',
  })
  @IsString()
  @IsOptional()
  city: string

  @ApiProperty({
    type: 'string',
    description: 'Zip',
    example: '',
  })
  @IsString()
  @IsOptional()
  post_code: string

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
    description: 'Verified',
    example: '',
  })
  @IsBoolean()
  @IsOptional()
  verified: boolean

  @ApiProperty({
    type: 'string',
    description: 'Active',
    example: '',
  })
  @IsBoolean()
  @IsOptional()
  active: boolean
}
