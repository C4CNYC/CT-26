import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GetFilesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lessonContentId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lessonId: string
}
