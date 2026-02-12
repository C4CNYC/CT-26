import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Course } from '../course/course.entity'

const ALIAS = 'course_certificates'

@Entity({ name: ALIAS })
export class CourseCertificate extends BaseEntity {
  @Column({ type: 'varchar' })
  name: boolean

  @Column({ type: 'varchar', nullable: true })
  description: boolean

  @OneToMany(() => Course, (course) => course.certificate)
  courses: Course[]
}
