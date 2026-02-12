import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RemoveStudentFromClassDto {
  @ApiProperty({
    type: 'string',
    description: 'Student id',
  })
  @IsString()
  student_id: string
}
