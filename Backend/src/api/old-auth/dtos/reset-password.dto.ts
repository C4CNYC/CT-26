import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class ResetPasswordDto {
  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'john@gmail.com',
  })
  @IsEmail({}, { message: 'email is invalid' })
  email: string
}
