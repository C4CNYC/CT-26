import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { School } from '../school/school.entity'
import { Socials } from './enums/social.enum'

const ALIAS = 'school-socials'

@Entity({ name: ALIAS })
export class SchoolSocial extends BaseEntity {
  @Column({ type: 'varchar' })
  type: Socials

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  link: string

  @ManyToOne(() => School, (school) => school.socials)
  school: School
}
