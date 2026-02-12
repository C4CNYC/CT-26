import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateSchoolSettingDto {
  @ApiProperty({
    type: 'string',
    description: 'Basic language for you site',
    example: 'en',
  })
  @IsString()
  @IsOptional()
  language: string

  @ApiProperty({
    type: 'string',
    description: 'Marketplace content allowed',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  marketplace_content_allowed: boolean

  @ApiProperty({
    type: 'string',
    description: 'Github login allowed',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  github_login_allowed: boolean

  @ApiProperty({
    type: 'string',
    description: 'Google login allowed',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  google_login_allowed: boolean

  @ApiProperty({
    type: 'string',
    description: 'Invite only',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  invite_only: boolean

  @ApiProperty({
    type: 'boolean',
    description: 'Show last name only of the students',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  last_name_only: boolean

  @ApiProperty({
    type: 'string',
    description: 'Chat allowed',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  chat_allowed: boolean

  @ApiProperty({
    type: 'string',
    description: 'Gallery allowed',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  gallery_allowed: boolean

  @ApiProperty({
    type: 'string',
    description: 'Global gallery allowed',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  global_gallery_allowed: boolean
}
