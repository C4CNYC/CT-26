import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class AddMentorToClassDto {
  @ApiProperty({
    type: 'string',
    description: 'user id',
    example: '',
  })
  @IsUUID()
  user_id: string
}
