import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateProfileDto {
  @ApiProperty({
    type: 'string',
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  first_name: string

  @ApiProperty({
    type: 'string',
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  last_name: string
}
