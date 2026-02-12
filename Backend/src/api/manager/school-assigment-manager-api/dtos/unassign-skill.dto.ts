import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UnassignSkillDto {
  @ApiProperty({
    type: 'string',
    description: 'skill_id',
  })
  @IsString()
  skill_id: string
}
