import { Column, Entity, OneToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Class } from '../class/class.entity'

const ALIAS = 'classes-preferences'

@Entity({ name: ALIAS })
export class ClassSetting extends BaseEntity {
  @Column({ type: 'boolean', default: true })
  share_token_enable: boolean

  @Column({ type: 'boolean', default: true })
  request_join_enable: boolean

  @Column({ type: 'boolean', default: true })
  subscribe_enable: boolean

  @Column({ type: 'varchar', nullable: true, unique: true })
  share_token: string

  @OneToOne(() => Class, (shoolClass) => shoolClass.setting)
  class: Class
}
