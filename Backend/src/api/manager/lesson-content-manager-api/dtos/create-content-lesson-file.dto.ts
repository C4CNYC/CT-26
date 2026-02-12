import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
 

export class CreateContentLessonFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly extension: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly preloaded_code: string
}
