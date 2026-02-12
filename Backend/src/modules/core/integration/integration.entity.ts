import { Column, Entity, ManyToMany, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Lesson } from '../lesson/lesson.entity'
import { Organization } from '../organization/organization.entity'

const ALIAS = 'integration'

@Entity({ name: ALIAS })
export class Integration extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', nullable: true })
  head: string

  @Column({ type: 'varchar', nullable: true })
  scripts: string

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization

  @Column({ type: 'uuid' })
  organization_id: string

  @Column({ type: 'boolean', default: false })
  public: boolean

  @ManyToMany(() => Lesson, (lesson) => lesson.integrations)
  lessons: Lesson[]
}