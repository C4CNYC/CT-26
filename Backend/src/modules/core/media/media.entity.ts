import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '@/modules/core/user/user.entity'

import { BaseEntity } from '../../../utils/base/base.entity'
import { School } from '../school/school.entity'
import { MediaACLs } from './enums/media-acls.enum'
import { MediaTypes } from './enums/media-type.enum'

const ALIAS = 'medias'

@Entity({ name: ALIAS })
export class Media extends BaseEntity {
  @Column({ type: 'boolean', default: true })
  active: boolean

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  url: string

  @Column({
    type: 'enum',
    enum: MediaTypes,
    default: MediaTypes.IMAGE,
    nullable: false,
  })
  type: MediaTypes

  @Column({
    type: 'enum',
    enum: MediaACLs,
    default: MediaACLs.PUBLIC,
    nullable: false,
  })
  acl: MediaACLs

  @Column({ type: 'int', nullable: true })
  size: number

  @Column({ nullable: true })
  userId: string

  @Column({ nullable: true })
  schoolId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => School, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'schoolId' })
  school: User
}
