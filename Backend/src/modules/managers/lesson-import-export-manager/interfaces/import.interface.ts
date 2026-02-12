export interface ImportValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
 

export interface ImportOptions {
  overwriteExisting?: boolean
  generateNewSlugs?: boolean
  skipValidations?: boolean
}