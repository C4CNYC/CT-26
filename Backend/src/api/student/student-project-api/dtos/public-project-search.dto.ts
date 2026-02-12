import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class MyPublicProjectSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly title?: string

  @IsString()
  @IsOptional()
  readonly student_id?: string

  @IsString()
  @IsOptional()
  readonly class_id?: string
}
