import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm'

import { User } from '@/modules/core/user/user.entity'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Country } from '../../../utils/enums/countries.enum'
import { Assigment } from '../assigment/assigment.entity'
import { Class } from '../class/class.entity'
import { CourseUnit } from '../course-unit/course-unit.entity'
import { Course } from '../course/course.entity'
import { Lesson } from '../lesson/lesson.entity'
import { Organization } from '../organization/organization.entity'
import { SchoolContact } from '../school-contact/school-contact.entity'
import { SchoolSetting } from '../school-setting/school-setting.entity'
import { SchoolSocial } from '../school-social/school-social.entity'
import { StudentInvitation } from '../student-invitation/student-invitation.entity'
import { Student } from '../student/student.entity'
import { SchoolType } from './enums/school-type.enum'

const ALIAS = 'schools'

@Entity({ name: ALIAS })
export class School extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', nullable: true })
  country: Country

  @Column({ type: 'varchar', nullable: true })
  address: string

  @Column({ type: 'varchar', nullable: true })
  phone: string

  @Column({ type: 'varchar', nullable: true })
  city: string

  @Column({ type: 'varchar', nullable: true })
  zip: string

  @Column({ type: 'enum', enum: SchoolType, nullable: true })
  type: SchoolType

  @Column({ type: 'varchar', nullable: true })
  about: string

  @OneToMany(() => Class, (scholeClass) => scholeClass.school)
  classes: Class[]

  @OneToMany(() => Lesson, (lesson) => lesson.school)
  lessons: Lesson[]

  @OneToMany(() => CourseUnit, (courseUnit) => courseUnit.school)
  courseUnits: CourseUnit[]

  @Column({ type: 'boolean', default: true })
  active: boolean

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @Column({ type: 'varchar', nullable: true })
  cover: string

  @OneToOne(() => SchoolContact, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  contact: SchoolContact

  @ManyToOne(() => Organization)
  organization: Organization

  @OneToOne(() => SchoolSetting, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  setting: SchoolSetting

  @OneToMany(() => SchoolSocial, (schoolSocial) => schoolSocial.school, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  socials: SchoolSocial[]

  @OneToMany(() => StudentInvitation, (invites) => invites.school, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  invites: StudentInvitation[]

  @OneToMany(() => Assigment, (assigment) => assigment.school, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assigments: Assigment[]

  @ManyToMany(() => Course, (course) => course.schools)
  courses: Course[]

  @ManyToMany(() => Student, (student) => student.school, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'student_schools',
    joinColumn: {
      name: 'schoolId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'studentId',
      referencedColumnName: 'id',
    },
  })
  students: Student[]

  @ManyToMany(() => User, (user) => user.schools)
  @JoinTable({
    name: 'users_schools',
    joinColumn: {
      name: 'schoolId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  teachers: User[]
}
