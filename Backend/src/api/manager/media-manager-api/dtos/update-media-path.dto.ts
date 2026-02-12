import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateMediaPathDto {
  @ApiProperty({
    type: 'string',
    description: 'Old Path',
    example: '/medias/test',
  })
  @IsString()
  path: string

  @ApiProperty({
    type: 'string',
    description: 'New Path',
    example: '/medias/test2',
  })
  @IsString()
  newPath: string
}
