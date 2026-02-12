import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class ClassSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsString()
  @IsOptional()
  readonly class_id?: string

  @IsString()
  @IsOptional()
  user_id?: string
}
