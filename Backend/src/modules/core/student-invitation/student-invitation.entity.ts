import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { School } from '../school/school.entity'

const ALIAS = 'student-invitations'

@Entity({ name: ALIAS })
export class StudentInvitation extends BaseEntity {
  @Column({ unique: true })
  email: string

  @ManyToOne(() => School, (school) => school.invites)
  school: School

  @Column({ type: 'timestamp with time zone' })
  expiresAt: string

  @Column({ type: 'int' })
  code: number

  @Column({ type: 'boolean', default: false })
  isUsed: boolean
}
