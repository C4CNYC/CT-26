import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class AccessControlUpdateDto {
  @ApiProperty({
    type: 'string',
    description: 'Name of feature to limit access',
    example: 'MumuMenuNewLesson',
  })
  @IsString()
  @IsOptional()
  feature: string

  @ApiProperty({
    type: 'number',
    description: 'Max usage count',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  maxUsageCount: number
}
