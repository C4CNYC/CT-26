import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateSkillDto {
  @ApiProperty({
    type: 'string',
    description: 'Name',
    example: 'HTML',
  })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Description',
    example: '<link ....',
  })
  @IsString()
  @IsOptional()
  description: string
}
