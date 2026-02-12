import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateCourseAuthorDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: '',
  })
  @IsString()
  @IsOptional()
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
}
