import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

import { Role } from '../../../../modules/core/user/enums/role.enum'
import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class UserOptionDto extends PageOptionsDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly name?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly email?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly school_id?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly org_id?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly role?: Role.Manager | Role.Admin

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly skipRole?: Role.Student
}
