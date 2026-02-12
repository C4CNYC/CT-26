import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddAuthorDto {
  @ApiProperty({
    type: 'string',
    description: 'User ID',
    example: '',
  })
  @IsString()
  user_id: string
}
