import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

import { MediaACLs } from '../../../../modules/core/media/enums/media-acls.enum'
import { MediaTypes } from '../../../../modules/core/media/enums/media-type.enum'

export class CreateMediaDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'IMG-1234.jpg',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'URL',
    example: 'https://google.com/',
  })
  @IsString()
  url: string

  @ApiProperty({
    type: 'number',
    description: 'File size in bytes',
    example: 1353000,
  })
  @IsNumber()
  size: number

  @ApiProperty({
    type: 'string',
    description: 'Identify if its a image or a folder',
    enum: [MediaTypes.FOLDER, MediaTypes.IMAGE],
    default: MediaTypes.IMAGE,
  })
  @IsString()
  type: MediaTypes

  @ApiProperty({
    type: 'string',
    description: 'Mark if its a public or private media',
    enum: [MediaACLs.PUBLIC, MediaACLs.PRIVATE],
    default: MediaACLs.PUBLIC,
  })
  @IsString()
  acl: MediaACLs
}
