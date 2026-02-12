import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class SubmitPasswordDto {
  @ApiProperty({
    type: 'string',
    description: 'ID',
    example: '',
  })
  @IsUUID()
  id: string

  @ApiProperty({
    type: 'string',
    description: 'Password',
    example: '',
  })
  @IsString()
  password: string
}
