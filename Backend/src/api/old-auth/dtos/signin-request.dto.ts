import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

export class SignigRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'john@gmail.com',
  })
  @IsEmail({}, { message: 'email is invalid' })
  @Transform((email: { value?: string }) => email.value?.toLowerCase())
  email: string

  @ApiProperty({
    type: 'string',
    description: 'Password',
    example: '*****',
  })
  @IsString()
  password: string
}
