import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class RemoveMentorFromClassDto {
  @ApiProperty({
    type: 'string',
    description: 'course id',
    example: '',
  })
  @IsUUID()
  user_id: string
}
