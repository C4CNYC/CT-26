import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class AdminCourseCatalogDto {
  @ApiProperty({
    type: 'boolean',
    description: 'Set value to true to show course in catalog, false to hide',
    example: 'false',
  })
  @IsBoolean()
  is_show_in_catalog: boolean = false

  @ApiProperty({
    type: 'string',
    description: 'Organization id',
    example: '',
  })
  @IsString()
  org_id: string
}
