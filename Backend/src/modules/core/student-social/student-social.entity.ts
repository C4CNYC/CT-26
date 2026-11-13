import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Student } from '../student/student.entity'
import { Socials } from './enums/social.enum'

const ALIAS = 'student-socials'

@Entity({ name: ALIAS })
export class StudentSocial extends BaseEntity {
  @Column({ type: 'varchar' })
  type: Socials

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  link: string

  @ManyToOne(() => Student, (student) => student.socials, {
    onDelete: 'CASCADE',
  })
  student: Student
}
