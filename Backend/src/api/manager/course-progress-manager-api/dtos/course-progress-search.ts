import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class CourseProgressSearch extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly course_id?: string
}
