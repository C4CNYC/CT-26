import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { Country } from '../../../utils/enums/countries.enum'

export class UpdateStudentProfileDto {
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
    description: 'Username',
    example: 'someusername',
  })
  @IsString()
  @IsOptional()
  username: string

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
    description: 'Phone Number',
    example: '+482342323',
  })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Conutry',
    enum: Country,
  })
  @IsOptional()
  @IsEnum(Country)
  country?: Country

  @ApiPropertyOptional({
    type: 'string',
    description: 'State',
    example: '',
  })
  @IsOptional()
  state?: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Cover',
    example: '',
  })
  @IsOptional()
  cover?: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'State',
    example: '',
  })
  @IsOptional()
  city?: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Post Code',
    example: '',
  })
  @IsOptional()
  post_code?: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'About',
    example: '',
  })
  @IsOptional()
  about?: string
}
