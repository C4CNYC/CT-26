import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateClassSettingDto {
  @ApiProperty({
    type: 'boolean',
    description: 'subscribe_enable',
    example: '',
  })
  @IsOptional()
  @IsBoolean()
  share_token_enable: boolean

  @ApiProperty({
    type: 'boolean',
    description: 'subscribe_enable',
    example: '',
  })
  @IsOptional()
  @IsBoolean()
  request_join_enable: boolean

  @ApiProperty({
    type: 'boolean',
    description: 'subscribe_enable',
    example: '',
  })
  @IsOptional()
  @IsBoolean()
  subscribe_enable: boolean
}
