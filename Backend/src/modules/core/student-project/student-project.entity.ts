import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'student-projects'

@Entity({ name: ALIAS })
export class StudentProject extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string

  @Column({ type: 'varchar' })
  description: string

  @Column({ type: 'varchar', nullable: true })
  cover: string

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @Column({ type: 'varchar' })
  language: string

  @Column({ type: 'json', nullable: true })
  body: Record<string, unknown>

  @Column({ type: 'boolean', default: false })
  public: boolean

  @ManyToOne(() => Student, (student) => student.projects, {
    onDelete: 'CASCADE',
  })
  student: Student
}
