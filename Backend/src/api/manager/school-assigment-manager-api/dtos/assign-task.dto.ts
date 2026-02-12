import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AssignTaskDto {
  @ApiProperty({
    type: 'string',
    description: 'task_id',
  })
  @IsString()
  task_id: string
}
