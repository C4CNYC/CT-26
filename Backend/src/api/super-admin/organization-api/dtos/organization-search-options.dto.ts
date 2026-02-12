import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '@/utils/dtos/page-option.dto'

export class OrganizationSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string
}
