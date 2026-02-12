import { Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Class } from '../class/class.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'class-student-pending'

@Entity({ name: ALIAS })
export class ClassStudentPending extends BaseEntity {
  @ManyToOne(() => Student, (student) => student.pendings)
  student: Student

  @ManyToOne(() => Class, (school_class) => school_class.pendings)
  class: Class
}
