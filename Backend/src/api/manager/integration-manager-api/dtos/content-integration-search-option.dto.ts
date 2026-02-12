import { IsBooleanString, IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class IntegrationSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsBooleanString()
  @IsOptional()
  readonly public?: boolean

  @IsString()
  @IsOptional()
  readonly organization_id?: string
}