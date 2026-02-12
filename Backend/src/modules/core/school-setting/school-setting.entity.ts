import { Column, Entity, OneToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { School } from '../school/school.entity'

const ALIAS = 'school-settings'

@Entity({ name: ALIAS })
export class SchoolSetting extends BaseEntity {
  @Column({ type: 'varchar', default: 'en' })
  language: string

  @Column({ type: 'boolean', default: false })
  marketplace_content_allowed: boolean

  @Column({ type: 'boolean', default: false })
  github_login_allowed: boolean

  @Column({ type: 'boolean', default: false })
  google_login_allowed: boolean

  @Column({ type: 'boolean', default: false })
  invite_only: boolean

  @Column({ type: 'boolean', default: true })
  last_name_only: boolean

  @Column({ type: 'boolean', default: false })
  chat_allowed: boolean

  @Column({ type: 'boolean', default: false })
  gallery_allowed: boolean

  @Column({ type: 'boolean', default: false })
  global_gallery_allowed: boolean

  @OneToOne(() => School, (school) => school.setting) // specify inverse side as a second parameter
  school: School
}
