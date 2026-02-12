import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class InviteStudentDto {
  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'johndoe@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    type: 'string',
    description: 'Class ID',
    example: '',
  })
  @IsString()
  @IsOptional()
  class_id: string
}
