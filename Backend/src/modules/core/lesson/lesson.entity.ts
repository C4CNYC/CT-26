import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import { LessonLastSlide } from '@/modules/core/lesson-last-slide/lesson-last-slide.entity'
import { User } from '@/modules/core/user/user.entity'

import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { BaseEntity } from '../../../utils/base/base.entity'
import { Assigment } from '../assigment/assigment.entity'
import { CourseUnit } from '../course-unit/course-unit.entity'
import { LessonToCourseUnit } from '../course-unit/lesson-to-course-unit.entity'
import { Integration } from '../integration/integration.entity'
import { LessonContent } from '../lesson-content/lesson-content.entity'
import { LessonToEnvironment } from '../lesson-to-environment/lesson-to-environment.entity'
import { School } from '../school/school.entity'
import { Skill } from '../skills/skill.entity'
import { StudentLessonFile } from '../student-lesson-file/student-lesson-file.entity'
import { Student } from '../student/student.entity'
import { LessonType } from './enums/lesson-type.enum'

const ALIAS = 'lessons'

@Entity({ name: ALIAS })
export class Lesson extends BaseEntity {
  @Column({ type: 'boolean', default: true })
  active: boolean

  @Column({ type: 'boolean', default: true })
  draft: boolean

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'boolean', default: true })
  auto_graded: boolean

  @Column({ type: 'boolean', default: true })
  core: boolean

  @Column({
    type: 'enum',
    enum: LessonType,
    nullable: true,
    default: LessonType.PRACTICAL,
  })
  type: LessonType

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'varchar', nullable: true })
  head: string

  @ManyToOne(() => User, (user) => user.lessons, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User

  @Column({ type: 'varchar', nullable: true })
  userId: string

  @Column('varchar', { array: true, default: [] })
  tips: string[]

  @OneToMany(() => LessonContent, (lessonContent) => lessonContent.lesson, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contents: LessonContent[]

  @OneToMany(() => Assigment, (assigment) => assigment.lesson, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assigments: Assigment[]

  @OneToMany(
    () => StudentLessonFile,
    (studentLessonFile) => studentLessonFile.lesson,
    { onDelete: 'CASCADE' },
  )
  studentFiles: StudentLessonFile[]

  @ManyToMany(() => User, (user) => user.lessons, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  authors: User[]

  @Column({ type: 'interval', nullable: true })
  duration: string

  @ManyToMany(() => CourseUnit, (courseUnit) => courseUnit.lessons, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    synchronize: false,
    name: 'lesson_to_course_unit',
    joinColumn: { name: 'lessonId' },
    inverseJoinColumn: { name: 'courseUnitId' },
  })
  units: CourseUnit[]

  @ManyToOne(() => School, (school) => school.lessons)
  @JoinColumn()
  school: School

  @OneToMany(
    () => LessonToCourseUnit,
    (lessonToCourseUnit) => lessonToCourseUnit.lesson,
  )
  lessonToUnits: LessonToCourseUnit[]

  @OneToMany(() => LessonLastSlide, (lessonSlide) => lessonSlide.lesson)
  last_slides: LessonLastSlide[]

  @ManyToMany(() => Skill, (skill) => skill.lessons)
  skills: Skill[]

  @ManyToMany(() => Integration, (integration) => integration.lessons, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable({ name: 'lesson-integrations' })
  integrations: Integration[]

  @OneToMany(() => Student, (student) => student.lesson)
  students: Student[]

  @Column({ type: 'boolean', nullable: true })
  independent: boolean

  @Column({ type: 'varchar', nullable: false, unique: true })
  slug: string

  @Column({ type: 'jsonb', nullable: true, default: {} })
  meta: { [key: string]: string | number }

  @ManyToMany(() => Environment, (environment) => environment.lessons, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'lesson_to_environment',
    joinColumn: { name: 'lessonId' },
    inverseJoinColumn: { name: 'environmentId' },
  })
  environments: Environment[]

  @OneToMany(
    () => LessonToEnvironment,
    (lessonToEnvironment) => lessonToEnvironment.lesson,
  )
  lessonToEnvironments: LessonToEnvironment[]
}
