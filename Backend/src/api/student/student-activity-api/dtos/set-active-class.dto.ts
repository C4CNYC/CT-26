import { IsString } from 'class-validator'

export class SetActiveClassDto {
  @IsString()
  readonly class_id: string
}
