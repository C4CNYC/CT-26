import { Column, Entity } from 'typeorm'

import { BaseEntity } from '@/utils/base/base.entity'

const ALIAS = 'properties'

@Entity({ name: ALIAS })
export class Properties extends BaseEntity {
  // Type of entity, e.g., "lesson", "school", "user"
  @Column({ type: 'varchar', length: 50 })
  entityType: string

  // ID of the specific entity (e.g., lesson ID or user ID)
  @Column({ type: 'varchar', length: 100 })
  entityId: string

  // Name of the property, e.g., "autosave", "lock"
  @Column({ type: 'varchar', length: 100 })
  propertyName: string

  // Value of the property, stored as a string (could be JSON, boolean, etc.)
  @Column({ type: 'text', nullable: true })
  propertyValue: string
}
