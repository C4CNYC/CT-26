import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

import { Role } from '../../../../modules/core/user/enums/role.enum'

export class CreateMemberDto {
  @ApiProperty({
    type: 'string',
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  first_name?: string

  @ApiProperty({
    type: 'string',
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  last_name?: string

  @ApiProperty({
    type: 'boolean',
    description: 'Verified',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  verified: boolean

  @ApiProperty({
    type: 'boolean',
    description: 'Active',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  active: boolean

  @ApiProperty({
    type: 'string',
    description: 'Role',
    enum: [Role.Manager, Role.Admin, Role.Editor, Role.Student],
  })
  @IsString()
  role: Role.Manager | Role.Admin | Role.Editor | Role.Student

  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'john@gmail.com',
  })
  @IsEmail()
  email: string
}
