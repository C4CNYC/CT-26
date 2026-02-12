import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class MyProjectSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly title?: string

  @IsString()
  @IsOptional()
  readonly username?: string

  @IsString()
  @IsOptional()
  readonly class_id?: string

  @IsBoolean()
  @IsOptional()
  readonly public?: boolean
}
