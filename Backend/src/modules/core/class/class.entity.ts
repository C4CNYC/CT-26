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
import { Assigment } from '../assigment/assigment.entity'
import { ClassSetting } from '../class-setting/class-setting.entity'
import { ClassStudentPending } from '../class-student-pending/class-student-pending.entity'
import { Course } from '../course/course.entity'
import { School } from '../school/school.entity'
import { Student } from '../student/student.entity'
import { UserActivity } from '../user-activity/user-activity.entity'

const ALIAS = 'classes'

@Entity({ name: ALIAS })
export class Class extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @Column({ type: 'varchar', nullable: true })
  cover: string

  @Column({ type: 'boolean', default: true })
  active: boolean

  @OneToMany(() => ClassStudentPending, (pendings) => pendings.class, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pendings: ClassStudentPending[]

  @OneToMany(() => UserActivity, (activity) => activity.lastActiveTribe, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  activities: UserActivity[]

  @ManyToOne(() => School, (school) => school.classes)
  school: School

  @ManyToMany(() => Student, (student) => student.classes, {
    onDelete: 'CASCADE',
  })
  students: Student[]

  @ManyToMany(() => User, (student) => student.classes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'class_mentors' })
  mentors: User[]

  @OneToOne(() => ClassSetting, (setting) => setting.class, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'class-setting' })
  setting: ClassSetting

  @ManyToMany(() => Course, (course) => course.classes, {
    onDelete: 'CASCADE',
  })
  courses: Course[]

  @ManyToMany(() => Assigment, (assigment) => assigment.assignee_classes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'class_assigment' })
  assigments: Assigment[]
}
