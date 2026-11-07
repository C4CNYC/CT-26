import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { School } from '../school/school.entity'
import { User } from '../user/user.entity'
import { HomePageType } from './enums/home-page-type.enum'

const ALIAS = 'organization'

@Entity({ name: ALIAS })
// Unique on LOWER(slug), created by migration UniqueOrganizationSlug; TypeORM can't express it
@Index('organization_slug_lower_unique', { synchronize: false })
export class Organization extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  slug: string

  @Column({ type: 'varchar' })
  domain: string

  @Column({ type: 'varchar', nullable: true })
  logo: string

  @Column({ type: 'varchar', nullable: true })
  min_logo: string

  @Column({ type: 'varchar', nullable: true })
  favicon: string

  @Column({
    type: 'enum',
    enum: HomePageType,
    default: HomePageType.Default,
  })
  home_page_type: HomePageType

  @Column({ type: 'varchar', nullable: true })
  home_page_body: string

  @OneToMany(() => School, (school) => school.organization)
  schools: School[]

  @OneToMany(() => User, (user) => user.organization)
  users: User[]

  @OneToOne(() => User, (user) => user.organization)
  @JoinColumn()
  owner: User

  @Column({ type: 'varchar', nullable: true })
  city: string

  @Column({ type: 'varchar', nullable: true })
  country: string

  @Column({ type: 'varchar', nullable: true })
  org_type: string

  @Column({ type: 'integer', nullable: true })
  student_count_current: number

  @Column({ type: 'integer', nullable: true })
  student_count_expected: number

  @Column({ type: 'varchar', nullable: true })
  subdomain: string

  @Column({ type: 'text', nullable: true })
  note: string

  @Column({ type: 'json', nullable: true, default: {} })
  meta: { [key: string]: string | number | boolean }
}
