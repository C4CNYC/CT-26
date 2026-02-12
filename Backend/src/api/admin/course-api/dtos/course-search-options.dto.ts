import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class CourseSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsString()
  @IsOptional()
  readonly class_id?: string

  @IsString()
  @IsOptional()
  readonly school_id?: string

  @IsString()
  @IsOptional()
  readonly authors?: string

  @IsOptional()
  readonly catalog?: boolean | string

  @IsOptional()
  readonly user_id?: string
}
