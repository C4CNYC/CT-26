import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SubmiInviteDto {
  @ApiProperty({
    type: 'string',
    description: 'Password',
    example: '****',
  })
  @IsString()
  password: string

  @ApiProperty({
    type: 'string',
    description: 'Invite is',
    example: '****',
  })
  @IsString()
  inviteId: string
}
