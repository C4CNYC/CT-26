import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
 

export class UpdateFileDto {
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
  readonly body: string
}
