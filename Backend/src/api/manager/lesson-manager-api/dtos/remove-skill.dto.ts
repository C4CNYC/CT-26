import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class RemoveSkillDto {
  @ApiProperty({
    type: 'string',
    description: 'Skill id',
    example: '',
  })
  @IsUUID()
  skill_id: string
}
