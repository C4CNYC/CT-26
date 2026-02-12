import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl } from 'class-validator'

import { Socials } from '../../../../modules/core/student-social/enums/social.enum'

export class UpdateStudentSocialDto {
  @ApiProperty({
    type: 'string',
    description: 'Social type',
    example: 'youtube',
  })
  @IsString()
  @IsOptional()
  type: Socials

  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'CodeTribe',
  })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Link',
    example: '',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  link: string
}
