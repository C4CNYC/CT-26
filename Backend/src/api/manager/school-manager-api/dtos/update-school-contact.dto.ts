import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateSchoolContactDto {
  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'john@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email: string

  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Phone number',
    example: '+3808311938',
  })
  @IsString()
  @IsOptional()
  phone: string

  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'john@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  technical_email: string

  @ApiProperty({
    type: 'string',
    description: 'Technical Name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  technical_name: string

  @ApiProperty({
    type: 'string',
    description: 'Technical Phone number',
    example: '+3808311938',
  })
  @IsString()
  @IsOptional()
  technical_phone: string

  @ApiProperty({
    type: 'string',
    description: 'Billing Email',
    example: 'john@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  billing_email: string

  @ApiProperty({
    type: 'string',
    description: 'Billing Name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  billing_name: string

  @ApiProperty({
    type: 'string',
    description: 'Billing Phone number',
    example: '+3808311938',
  })
  @IsString()
  @IsOptional()
  billing_phone: string
}
