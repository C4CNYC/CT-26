/** @format */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Assigment } from '../assigment/assigment.entity'
import { Class } from '../class/class.entity'
import { CourseAuthor } from '../course-authors/course-authors.entity'
import { CourseCertificate } from '../course-certificate/course-certificate.entity'
import { CourseLike } from '../course-like/course-like.entity'
import { CourseRating } from '../course-rating/course-rating.entity'
import { CourseUnit } from '../course-unit/course-unit.entity'
import { School } from '../school/school.entity'
import { Student } from '../student/student.entity'
import { User } from '../user/user.entity'
import { CourseAge } from './enums/course-age.enum'
import { CourseLevel } from './enums/course-level.enum'

const ALIAS = 'courses'

@Entity({ name: ALIAS })
export class Course extends BaseEntity {
  @Column({ type: 'boolean', default: true })
  active: boolean

  @Column({ type: 'boolean', default: false })
  public: boolean

  @Column({ type: 'boolean', default: false })
  catalog: boolean

  @ManyToOne(() => User, (user) => user.teacher_courses, {
    onDelete: 'CASCADE',
  })
  user: User

  @Column({ type: 'varchar', nullable: true })
  userId: string

  @Column({ type: 'boolean', default: true })
  draft: boolean

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'money' })
  price: string

  @Column({ type: 'varchar', nullable: false, unique: true })
  content_id: string

  @Column({ type: 'enum', enum: CourseLevel, default: CourseLevel.Beginner })
  level: CourseLevel

  @Column({ type: 'varchar', nullable: true })
  customLevel: string

  @Column({ type: 'enum', enum: CourseAge, default: CourseAge.GRADE_1 })
  age: CourseAge

  @Column({ type: 'varchar', nullable: true })
  customAge: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'varchar', nullable: true })
  cover: string

  @Column({ type: 'varchar', nullable: true })
  preview: string

  @Column({ type: 'int', default: 2700 })
  initial_enrolled: number

  @Column({ type: 'int', default: 3200 })
  initial_likes: number

  @Column({ type: 'int', default: 8200 })
  initial_stars: number

  @OneToMany(() => CourseAuthor, (author) => author.course, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  authors: CourseAuthor[]

  @ManyToMany(() => School, (school) => school.courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  schools: School[]

  @ManyToMany(() => Class, (cleasses) => cleasses.courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  classes: Class[]

  @ManyToMany(() => CourseUnit, (courseUnit) => courseUnit.courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  units: CourseUnit[]

  @ManyToOne(() => CourseCertificate, (certificate) => certificate.courses, {
    onDelete: 'CASCADE',
  })
  certificate: CourseCertificate

  @OneToMany(() => CourseLike, (courseLike) => courseLike.course, {
    onDelete: 'CASCADE',
  })
  likes: CourseLike[]

  @OneToMany(() => Assigment, (assigments) => assigments.course, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assigments: Assigment[]

  @OneToMany(() => CourseRating, (ratings) => ratings.course, {
    onDelete: 'CASCADE',
  })
  ratings: CourseRating[]

  @OneToMany(() => Student, (student) => student.course)
  students: Student[]

  @Column({ type: 'varchar', nullable: true })
  audience: string

  @Column({ type: 'varchar', nullable: true })
  for_teachers: string

  @Column({ type: 'boolean', default: false })
  is_global: boolean
}
