import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '@/modules/core/user/user.entity'
import { BaseEntity } from '@/utils/base/base.entity'

const ALIAS = 'access-control'

@Entity({ name: ALIAS })
export class AccessControlEntity extends BaseEntity {
  @ManyToOne(() => User, (user) => user.accessControl)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'varchar' })
  feature: string

  @Column('int', { default: 0 })
  maxUsageCount: number
}
