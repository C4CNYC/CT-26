import { IsString } from 'class-validator'

export class PropertiesCreateOptions {
  @IsString()
  readonly entityType: string

  // ID of the specific entity (e.g., lesson ID or user ID)
  @IsString()
  entityId: string

  // Name of the property, e.g., "autosave", "lock"
  @IsString()
  propertyName: string

  // Value of the property, stored as a string (could be JSON, boolean, etc.)

  @IsString()
  propertyValue: string
}
