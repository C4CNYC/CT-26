import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ResetStudentPasswordDto {
  @ApiProperty({
    type: 'string',
    description: 'Password',
    example: '24AZ007',
  })
  @IsString()
  password: string
}
