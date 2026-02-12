/** @format */
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Course } from '../course/course.entity'

const ALIAS = 'course-author'

@Entity({ name: ALIAS })
export class CourseAuthor extends BaseEntity {
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

  @ManyToOne(() => Course, (course) => course.authors, {
    onDelete: 'CASCADE',
  })
  course: Course
}
