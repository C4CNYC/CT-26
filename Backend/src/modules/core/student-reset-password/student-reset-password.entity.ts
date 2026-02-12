import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'student-reset-password'

@Entity({ name: ALIAS })
export class StudentResetPassword extends BaseEntity {
  @Column()
  studentId: string

  @ManyToOne(() => Student, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student

  @Column({ type: 'timestamp with time zone' })
  expiresAt: string

  @Column({ type: 'boolean', default: false })
  isUsed: boolean
}
