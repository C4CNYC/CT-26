import { Column, Entity, ManyToOne, OneToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Class } from '../class/class.entity'
import { User } from '../user/user.entity'

const ALIAS = 'user-activity'

@Entity({ name: ALIAS })
export class UserActivity extends BaseEntity {
  @ManyToOne(() => Class)
  lastActiveTribe: Class | null

  @Column({ type: 'varchar', nullable: true })
  lastWorkspaceQuery: string

  @OneToOne(() => User)
  user!: User
}
