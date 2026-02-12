import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateSchoolSocialDto {
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
