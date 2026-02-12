import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import { InviteSystemType } from '@/modules/core/invite-system/interfaces/invite-system.interface'
import { Role } from '@/modules/core/user/enums/role.enum'

export class CreateInviteDto {
  @IsOptional()
  @IsString()
  createdBy?: string

  @IsOptional()
  @IsEmail()
  email: string | null

  @IsOptional()
  @IsString()
  organizationId?: string | null

  @IsOptional()
  @IsString()
  schoolId?: string | null

  @IsOptional()
  @IsString()
  classId?: string | null

  @IsOptional()
  @IsEnum(InviteSystemType)
  type?: InviteSystemType

  @IsOptional()
  @IsEnum(Role)
  role?: Role

  @IsOptional()
  @IsString()
  redirectUrl?: string | null

  @IsOptional()
  @IsDateString()
  expiresAt?: Date | null

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number
}
