import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class CodeAssignmentSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly name?: string
}
