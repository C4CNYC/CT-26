import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'

import { Role } from '../../../modules/core/user/enums/role.enum'

export class SignupRequestDto {
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
    description: 'First name',
    example: 'John',
  })
  @IsString()
  first_name: string

  @ApiProperty({
    type: 'string',
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  last_name: string

  @ApiPropertyOptional({
    type: 'string',
    description: 'Emoji Avatar',
    example: '🤖',
  })
  @IsString()
  @IsOptional()
  emojiAvatar?: string

  @ApiPropertyOptional({
    type: 'enum',
    description: 'Role',
    enum: Role,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role

  @ApiProperty({
    type: 'string',
    description: 'Password',
    example: '******',
  })
  @IsString()
  password: string
}
