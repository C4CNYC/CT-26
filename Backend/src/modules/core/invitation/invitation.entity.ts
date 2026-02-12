import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '@/modules/core/user/user.entity'

import { BaseEntity } from '../../../utils/base/base.entity'

const ALIAS = 'invitations'

@Entity({ name: ALIAS })
export class Invitation extends BaseEntity {
  @Column()
  userId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ type: 'timestamp with time zone' })
  expiresAt: string

  @Column({ type: 'boolean', default: false })
  isUsed: boolean
}
