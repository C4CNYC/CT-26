import { IsOptional, IsString } from 'class-validator'

import { PageOptionsDto } from '@/utils/dtos/page-option.dto'

export class PropertiesearchOptions extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly entityType: string

  // ID of the specific entity (e.g., lesson ID or user ID)
  @IsString()
  @IsOptional()
  entityId: string

  // Name of the property, e.g., "autosave", "lock"
  @IsString()
  @IsOptional()
  propertyName: string

  // Value of the property, stored as a string (could be JSON, boolean, etc.)

  @IsString()
  @IsOptional()
  propertyValue: string
}
