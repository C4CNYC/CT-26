import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CarryOverFilesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lessonId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly prevLessonId: string
}
