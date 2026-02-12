import { Exclude } from 'class-transformer'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm'

import { AuthToken } from '@/modules/core/user/auth-token.entity'

import { BaseEntity } from '../../../utils/base/base.entity'
import { AccessControlEntity } from '../access-control/access-control.entity'
import { Assigment } from '../assigment/assigment.entity'
import { Class } from '../class/class.entity'
import { CourseUnit } from '../course-unit/course-unit.entity'
import { Course } from '../course/course.entity'
import { LessonContent } from '../lesson-content/lesson-content.entity'
import { Lesson } from '../lesson/lesson.entity'
import { Organization } from '../organization/organization.entity'
import { School } from '../school/school.entity'
import { Student } from '../student/student.entity'
import { UserActivity } from '../user-activity/user-activity.entity'
import { Role } from './enums/role.enum'

import { Environment } from '@/api/manager/environments/entities/environment.entity';

const ALIAS = 'users'

@Entity({ name: ALIAS })
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  email: string

  @Column({ type: 'enum', enum: Role, default: Role.Manager })
  role: Role

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  password: string

  @Column({ type: 'varchar', nullable: true })
  first_name: string

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null

  @Column({ type: 'varchar', nullable: true })
  last_name: string

  @Column({ type: 'boolean', default: false })
  verified: boolean

  @Column({ type: 'boolean', default: true })
  active: boolean

  @ManyToMany(() => School, (school) => school.teachers)
  schools: School[]

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: Organization

  @ManyToMany(() => Course, (course) => course.authors)
  courses: Course[]

  @OneToMany(() => Lesson, (lessons) => lessons.user)
  lesson: Lesson[]

  @ManyToMany(() => Class, (student) => student.mentors)
  classes: Class[]

  @OneToMany(() => CourseUnit, (courseUnit) => courseUnit.user)
  courseUnits: CourseUnit[]

  @ManyToMany(() => Lesson, (lesson) => lesson.authors)
  lessons: Lesson[]

  @OneToMany(() => Assigment, (assigment) => assigment.creator)
  assigments: Assigment[]

  @OneToMany(() => Course, (course) => course.user)
  teacher_courses: Course[]

  @OneToMany(() => LessonContent, (content) => content.creator)
  lesson_contents: LessonContent[]

  @OneToOne(() => Student, (student) => student.account)
  @JoinColumn()
  student_profile: Student

  @OneToOne(() => UserActivity, (activity) => activity.user)
  @JoinColumn()
  activity: UserActivity

  @OneToOne(() => Organization, (organization) => organization.owner)
  organization_owner: Organization

  @Column({ type: 'varchar', nullable: true, unique: true })
  username: string

  @Column({ type: 'jsonb', nullable: true, default: {} })
  meta: { [key: string]: string | number | boolean }

  /********* START NEW ******************/

  @Column({ type: 'varchar', nullable: true })
  displayName: string

  @OneToMany((_) => AuthToken, (authToken) => authToken.user)
  authTokens: Promise<AuthToken[]>

  @OneToMany(
    () => AccessControlEntity,
    (userFeatureAccess) => userFeatureAccess.user,
  )
  accessControl: AccessControlEntity[]

  @OneToMany(() => Environment, (environment) => environment.user)
  environments: Environment[];

  private constructor() {
    super()
  }

  public static create(
    email: string,
    username?: string,
    displayName?: string,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    const newUser = new User()

    newUser.email = email

    if (username) {
      newUser.username = username
    }
    if (displayName) {
      newUser.displayName = displayName
    }
    newUser.avatar = null
    newUser.authTokens = Promise.resolve([])
    return newUser
  }
}
