import { IsString, IsUUID } from 'class-validator'

export class UpdateOrganizationOwnerDto {
  @IsString()
  @IsUUID()
  user_id: string
}
