import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { Role } from '@/modules/core/user/enums/role.enum'

export class AuthGoogleRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'CODE',
    example: '',
  })
  @IsString()
  code: string

  @ApiProperty({
    type: 'enum',
    description: 'Role',
    enum: Role,
  })
  @IsEnum(Role)
  @IsOptional()
  role: Role
}
