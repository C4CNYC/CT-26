import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl } from 'class-validator'

import { Socials } from '../../../../modules/core/school-social/enums/social.enum'

export class CreateSchoolSocialDto {
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
    description: 'Social type',
    example: 'youtube',
  })
  @IsString()
  @IsOptional()
  type: Socials

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
