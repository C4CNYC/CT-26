import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'


export class UpdateContentLessonFileDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly name: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly extension: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly preloaded_code: string
}
