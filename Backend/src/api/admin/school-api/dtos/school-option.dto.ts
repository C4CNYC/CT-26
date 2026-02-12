import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'

export class SchoolOptionDto extends PageOptionsDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'CodeTribe',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly name?: string

  @ApiProperty({
    type: 'string',
    description: 'Organization ID',
    example: 'uuid',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly org_id?: string
}
