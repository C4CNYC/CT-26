import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RemoveTeacherDto {
  @ApiProperty({
    type: 'string',
    description: 'User id',
    example: '',
  })
  @IsString()
  user_id: string
}
