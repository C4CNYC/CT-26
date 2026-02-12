import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
 

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly extension: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lessonId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lessonContentId: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly body: string
}
