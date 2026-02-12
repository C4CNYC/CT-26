/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform, Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class LessonSearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsString()
  @IsOptional()
  readonly course_id?: string

  @IsString()
  @IsOptional()
  readonly module_id?: string

  @IsString()
  @IsOptional()
  readonly assignment_id?: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly take: number = 10

  @IsString()
  @IsOptional()
  teacherId?: string

  @IsString()
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  @Transform(({ value }) => value?.toLowerCase())
  slug?: string
}
