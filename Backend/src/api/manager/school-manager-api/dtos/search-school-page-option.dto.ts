import { IsOptional } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class SearchSchoolPageOption extends PageOptionsDto {
  @IsOptional()
  name?: string
}
