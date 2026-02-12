import { IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class MyAssignmentsSearchOptions extends PageOptionsDto {
  @IsString()
  readonly class_id: string
}
