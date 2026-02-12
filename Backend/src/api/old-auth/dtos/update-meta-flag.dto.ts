import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class UpdateMetaFlagDto {
  @ApiProperty({
    type: 'string',
    description: 'The key of the meta flag to update',
    example: 'isFlag',
  })
  @IsString()
  key: string

  @ApiProperty({
    type: 'string | number | boolean',
    description: 'The value of the meta flag to update',
    example: 'true',
  })
  @IsBoolean()
  value: string | number | boolean
}
