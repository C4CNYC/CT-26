import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class GetGoogleClassesListDto {
  @ApiProperty({
    type: 'string',
    description: 'Access Token',
  })
  @IsString()
  access_token: string
}
