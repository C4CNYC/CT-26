import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class UnitAuthorSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly email?: string

  @IsString()
  @IsOptional()
  readonly course_unit_id?: string
}
