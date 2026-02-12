import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AssignSkillDto {
  @ApiProperty({
    type: 'string',
    description: 'skill_id',
  })
  @IsString()
  skill_id: string
}
