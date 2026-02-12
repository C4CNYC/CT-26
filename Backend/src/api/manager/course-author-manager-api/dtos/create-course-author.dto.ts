import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class CreateCourseAuthorDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: '',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'About',
    example: '',
  })
  @IsOptional()
  @IsString()
  about: string

  @ApiProperty({
    type: 'string',
    description: 'Linkedin link',
    example: '',
  })
  @IsOptional()
  @IsString()
  linkedin: string

  @ApiProperty({
    type: 'string',
    description: 'Class ID',
    example: '',
  })
  @IsString()
  course_id: string

  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: '',
  })
  @IsEmail()
  email: string
}
