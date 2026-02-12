import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class StudentJoinClassDto {
  @ApiProperty({
    type: 'string',
    description: 'share_token',
    example: '',
  })
  @IsString()
  share_token: string
}
