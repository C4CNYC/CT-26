import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class SchoolSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsString()
  @IsOptional()
  readonly class_id?: string

  @IsString()
  @IsOptional()
  readonly email?: string
}
