import { IsString } from 'class-validator'

export class ValidateInviteDto {
  @IsString()
  code: string
}
