import { IPostgresInterval } from 'postgres-interval'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Assigment } from '../assigment/assigment.entity'
import { CourseUnitAuthor } from '../course-unit-authors/course-unit-authors.entity'
import type { Course } from '../course/course.entity'
import { Lesson } from '../lesson/lesson.entity'
import { School } from '../school/school.entity'
import { Student } from '../student/student.entity'
import { User } from '../user/user.entity'
import { UnitAge } from './enums/unit-age.enum'
import { UnitGrading } from './enums/unit-grading.enum'
import { UnitLevel } from './enums/unit-level.enum'
import { LessonToCourseUnit } from './lesson-to-course-unit.entity'

const ALIAS = 'course_units'

@Entity({ name: ALIAS })
export class CourseUnit extends BaseEntity {
  @Column({ type: 'boolean', default: true })
  active: boolean

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @Column({ type: 'varchar', nullable: true })
  background: string

  @Column({ type: 'int', default: 2700 })
  initial_enrolled: number

  @Column({ type: 'int', default: 3200 })
  initial_likes: number

  @Column({ type: 'int', default: 8200 })
  initial_stars: number

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column('varchar', { array: true, default: [] })
  tips: string[]

  @Column({ type: 'interval', nullable: true })
  duration: IPostgresInterval

  @Column({ type: 'int', default: 0 })
  sort: number

  @ManyToMany('Course', (course: Course) => course.units, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  courses: Course[]

  @ManyToOne(() => User, (user) => user.courseUnits, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User

  @ManyToOne(() => School, (school) => school.courseUnits)
  @JoinColumn()
  school: School

  @ManyToMany(() => Lesson, (lesson) => lesson.units, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable({
    synchronize: false,
    name: 'lesson_to_course_unit',
    joinColumn: { name: 'courseUnitId' },
    inverseJoinColumn: { name: 'lessonId' },
  })
  lessons: Lesson[]

  @OneToMany(
    () => LessonToCourseUnit,
    (lessonToCourseUnit) => lessonToCourseUnit.courseUnit,
  )
  lessonToUnits: LessonToCourseUnit[]

  @OneToMany(() => Assigment, (assignment) => assignment.courseUnit)
  assigments: Assigment[]

  @OneToMany(() => Student, (student) => student.lesson)
  students: Student[]

  @Column({ type: 'enum', enum: UnitLevel, default: UnitLevel.Beginner })
  level: UnitLevel

  @Column({ type: 'varchar', nullable: true })
  customLevel: string

  @Column({ type: 'enum', enum: UnitAge, default: UnitAge.GRADE_1 })
  age: UnitAge

  @Column({ type: 'varchar', nullable: true })
  customAge: string

  @Column({ type: 'enum', enum: UnitGrading, default: UnitGrading.AUTO })
  grading: UnitGrading

  @Column({ type: 'varchar', nullable: true })
  brief: string

  @Column({ type: 'varchar', nullable: true })
  audience: string

  @OneToMany(() => CourseUnitAuthor, (author) => author.course_unit, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  authors: CourseUnitAuthor[]

  @Column({ type: 'varchar', nullable: true })
  teacher_forum: string

  @Column({ type: 'varchar', nullable: true })
  lesson_plans: string

  @Column({ type: 'varchar', nullable: true })
  teacher_slides: string

  @Column({ type: 'jsonb', nullable: true, default: {} })
  meta: { [key: string]: string | number }
}
