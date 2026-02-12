/** @format */
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Course } from '../course/course.entity'
import { Organization } from '../organization/organization.entity'

const ALIAS = 'catalog_course'

@Entity({ name: ALIAS })
@Unique(['organization_id', 'course_id'])
export class CatalogCourse extends BaseEntity {
  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization

  @Column({ type: 'uuid' })
  organization_id: string

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course

  @Column({ type: 'uuid' })
  course_id: string

  @Column({ type: 'boolean', default: true })
  is_show: boolean
}
