import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddIntegrationDto {
  @ApiProperty({
    type: 'string',
    description: 'Integration id',
    example: '',
  })
  @IsString()
  integration_id: string
}
