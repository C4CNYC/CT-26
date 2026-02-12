import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class MyGoalSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly title?: string
}
