import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
} from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Class } from '../class/class.entity'
import { CodeAssignment } from '../code-assignment/code-assignment.entity'
import { CourseUnit } from '../course-unit/course-unit.entity'
import { Course } from '../course/course.entity'
import { Lesson } from '../lesson/lesson.entity'
import { School } from '../school/school.entity'
import { Skill } from '../skills/skill.entity'
import { Student } from '../student/student.entity'
import { User } from '../user/user.entity'
import { AssigmentStatuses } from './enums/assigment-status.enum'
import {
  AssigmentTypes,
  AssignmentProjectCategories,
} from './enums/assigment-type'

const ALIAS = 'assigments'

@Entity({ name: ALIAS })
export class Assigment extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', nullable: true })
  courseUnitId: string

  @Column({ type: 'varchar', nullable: true })
  lessonId: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'enum', enum: AssigmentTypes, nullable: true })
  type: AssigmentTypes

  @Column({ type: 'enum', enum: AssignmentProjectCategories, nullable: true })
  category: AssignmentProjectCategories

  @Column({ type: 'varchar', nullable: true })
  language: string

  @Column({ type: 'varchar', nullable: true })
  lessonTitle: string

  @Column({
    type: 'enum',
    enum: AssigmentStatuses,
    default: AssigmentStatuses.OPEN,
  })
  status: AssigmentStatuses

  @Column({ type: 'interval', nullable: true })
  duration: string

  @Column({ type: 'boolean', default: true })
  active: boolean

  @CreateDateColumn({ type: 'timestamp with time zone' })
  start_date: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  end_date: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  close_date: string

  @Column({ type: 'json', nullable: true, default: {} })
  meta: { [key: string]: string | number }

  @ManyToMany(() => Student, (student) => student.pined_assignment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pined_by_students: Student[]

  @ManyToOne(
    () => CodeAssignment,
    (codeAssignment) => codeAssignment.assigments,
  )
  code_assignment: CodeAssignment

  @ManyToOne(() => Lesson, (lesson) => lesson.assigments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  lesson: Lesson

  @ManyToOne(() => User, (user) => user.assigments, {
    onDelete: 'SET NULL',
  })
  creator: User

  @ManyToOne(() => CourseUnit, (unit) => unit.assigments)
  courseUnit: CourseUnit

  @ManyToOne(() => School, (school) => school.assigments)
  school: School

  @ManyToOne(() => Course, (course) => course.assigments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  course: Course

  @ManyToMany(() => Student, (student) => student.assigments, {
    onDelete: 'CASCADE',
  })
  assignee_students: Student[]

  @ManyToMany(() => Class, (sClasses) => sClasses.assigments, {
    onDelete: 'CASCADE',
  })
  assignee_classes: Class[]

  @ManyToMany(() => Skill, (skill) => skill.assigments, { onDelete: 'CASCADE' })
  skill_tags: Skill[]
}
