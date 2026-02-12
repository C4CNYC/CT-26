import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '@/modules/core/user/user.entity'
import { BaseEntity } from '@/utils/base/base.entity'

import { InviteSystemType } from '../invite-system/interfaces/invite-system.interface'
import { Role } from '../user/enums/role.enum'

const ALIAS = 'invite-system'

@Entity({ name: ALIAS })
export class InviteSystem extends BaseEntity {
  @Column({ type: 'varchar' })
  createdBy: string

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User

  @Column({ type: 'varchar', nullable: true })
  email: string | null

  @Column({ type: 'varchar', nullable: true })
  organizationId: string | null

  @Column({ type: 'varchar', nullable: true })
  schoolId: string | null

  @Column({ type: 'varchar', nullable: true })
  classId: string | null

  @Column({ type: 'varchar' })
  type: InviteSystemType

  @Column({ type: 'varchar' })
  role: Role

  @Column({ type: 'varchar' })
  code: string

  @Column({ type: 'varchar', nullable: true })
  redirectUrl: string | null

  @Column({ type: 'int', default: 1 })
  maxUses: number

  @Column({ type: 'int', default: 0 })
  uses: number

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt: Date | null
}
