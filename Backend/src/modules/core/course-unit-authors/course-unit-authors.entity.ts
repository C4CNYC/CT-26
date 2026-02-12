/** @format */
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { CourseUnit } from '../course-unit/course-unit.entity'

const ALIAS = 'course-unit-author'

@Entity({ name: ALIAS })
export class CourseUnitAuthor extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string

  @Column({ type: 'varchar', nullable: true })
  about: string

  @Column({ type: 'varchar', nullable: true })
  linkedin: string

  @Column({ type: 'varchar', unique: false })
  email: string

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @ManyToOne(() => CourseUnit, (course_unit) => course_unit.authors, {
    onDelete: 'CASCADE',
  })
  course_unit: CourseUnit
}
