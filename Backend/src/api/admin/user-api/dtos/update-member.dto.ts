import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { Role } from '../../../../modules/core/user/enums/role.enum'

export class UpdateMemberDto {
  @ApiProperty({
    type: 'string',
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  first_name: string

  @ApiProperty({
    type: 'string',
    description: 'id',
    example: '',
  })
  @IsString()
  @IsOptional()
  id: string

  @ApiProperty({
    type: 'boolean',
    description: 'Verified',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  verified: boolean

  @ApiProperty({
    type: 'string',
    description: 'Active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  active: boolean

  @ApiProperty({
    type: 'string',
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  last_name: string

  @ApiProperty({
    type: 'string',
    description: 'Role',
    enum: Role,
  })
  @IsString()
  @IsOptional()
  role: Role.Manager | Role.Admin
}
