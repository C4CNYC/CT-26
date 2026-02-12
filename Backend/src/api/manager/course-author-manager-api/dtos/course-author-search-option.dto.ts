import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class CourseAuthorSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly email?: string

  @IsString()
  @IsOptional()
  readonly course_id?: string
}
