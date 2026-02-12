import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class MigrateGoogleClassesStudentsDto {
  @ApiProperty({
    type: 'string',
    description: 'Access Token',
  })
  @IsString()
  access_token: string

  @ApiProperty({
    type: 'string',
    description: 'Google Class Id',
  })
  @IsString()
  google_class_id: string
}
