import { Column, Entity, OneToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { School } from '../school/school.entity'

const ALIAS = 'school-contacts'

@Entity({ name: ALIAS })
export class SchoolContact extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  email: string

  @Column({ type: 'varchar', nullable: true })
  name: string

  @Column({ type: 'varchar', nullable: true })
  phone: string

  @Column({ type: 'varchar', nullable: true })
  technical_email: string

  @Column({ type: 'varchar', nullable: true })
  technical_name: string

  @Column({ type: 'varchar', nullable: true })
  technical_phone: string

  @Column({ type: 'varchar', nullable: true })
  billing_email: string

  @Column({ type: 'varchar', nullable: true })
  billing_name: string

  @Column({ type: 'varchar', nullable: true })
  billing_phone: string

  @OneToOne(() => School, (school) => school.contact)
  school: School
}
