import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'student-goals'

@Entity({ name: ALIAS })
export class StudentGoal extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string

  @Column({ type: 'varchar' })
  description: string

  @Column({ type: 'varchar' })
  color: string

  @ManyToOne(() => Student, (student) => student.goals)
  student: Student
}
