import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UnassignStudentDto {
  @ApiProperty({
    type: 'string',
    description: 'student_id',
  })
  @IsString()
  student_id: string
}
