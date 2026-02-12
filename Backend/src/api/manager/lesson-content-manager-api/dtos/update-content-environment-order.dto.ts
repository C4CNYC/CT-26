import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator'

export class UpdateContentEnvironmentOrderDto {
  @ApiProperty({
    type: 'string',
    description: 'Environment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  environment_id: string

  @ApiProperty({
    type: 'number',
    description: 'Sort order',
    example: 1.0,
  })
  @IsNumber()
  @IsNotEmpty()
  sort: number
}