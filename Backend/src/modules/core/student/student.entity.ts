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

import { LessonLastSlide } from '@/modules/core/lesson-last-slide/lesson-last-slide.entity'
import { User } from '@/modules/core/user/user.entity'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Country } from '../../../utils/enums/countries.enum'
import { Assigment } from '../assigment/assigment.entity'
import { ClassStudentPending } from '../class-student-pending/class-student-pending.entity'
import { Class } from '../class/class.entity'
import { CourseLike } from '../course-like/course-like.entity'
import { CourseProgress } from '../course-progress/course-progress.entity'
import { CourseRating } from '../course-rating/course-rating.entity'
import { CourseUnit } from '../course-unit/course-unit.entity'
import { Course } from '../course/course.entity'
import { LessonContentThreadDiscussionReaction } from '../lesson-content-thread-discussion-reaction/lesson-content-thread-discussion-reaction.entity'
import { LessonContentThreadDiscussion } from '../lesson-content-thread-discussion/lesson-content-thread-discussion.entity'
import { LessonContentThread } from '../lesson-content-thread/lesson-content-thread.entity'
import { Lesson } from '../lesson/lesson.entity'
import { School } from '../school/school.entity'
import { StudentGoal } from '../student-goal/student-goal.entity'
import { StudentLessonFile } from '../student-lesson-file/student-lesson-file.entity'
import { StudentProject } from '../student-project/student-project.entity'
import { StudentSocial } from '../student-social/student-social.entity'

const ALIAS = 'students'

@Entity({ name: ALIAS })
export class Student extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: true })
  username: string

  @Column({ type: 'varchar', nullable: true })
  first_name: string

  @Column({ type: 'varchar', nullable: true })
  last_name: string

  @Column({ type: 'varchar', nullable: true })
  phone: string

  @Column({ type: 'varchar', nullable: true })
  country: Country

  @Column({ type: 'varchar', nullable: true })
  state: string

  @Column({ type: 'varchar', nullable: true })
  city: string

  @Column({ type: 'varchar', nullable: true })
  post_code: string

  @Column({ type: 'varchar', nullable: true })
  cover: string

  @Column({ type: 'varchar', nullable: true })
  about: string

  @Column({ type: 'boolean', default: false })
  verified: boolean

  @Column({ type: 'boolean', default: false })
  active: boolean

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @ManyToOne(() => Lesson, (lesson) => lesson.students, {
    onDelete: 'SET NULL',
  })
  lesson: Lesson

  @ManyToOne(() => CourseUnit, (unit) => unit.students, {
    onDelete: 'SET NULL',
  })
  unit: CourseUnit

  @ManyToOne(() => Course, (course) => course.students, {
    onDelete: 'SET NULL',
  })
  course: Course

  @OneToMany(() => LessonContentThread, (thread) => thread.owner, {
    onDelete: 'SET NULL',
  })
  threads: LessonContentThread[]

  @OneToMany(
    () => LessonContentThreadDiscussion,
    (discussion) => discussion.owner,
    {
      onDelete: 'SET NULL',
    },
  )
  discussions: LessonContentThreadDiscussion[]

  @OneToMany(
    () => LessonContentThreadDiscussionReaction,
    (discussion) => discussion.owner,
    {
      onDelete: 'SET NULL',
    },
  )
  reactions: LessonContentThreadDiscussionReaction[]

  @ManyToMany(() => Assigment, (assigment) => assigment.pined_by_students, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  pined_assignment: Assigment[]

  @OneToMany(() => ClassStudentPending, (pendings) => pendings.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pendings: ClassStudentPending[]

  @OneToMany(() => StudentLessonFile, (lessonFiles) => lessonFiles.student, {
    onDelete: 'SET NULL',
  })
  lessonContentFiles: StudentLessonFile[]

  @OneToOne(() => User, (user) => user.student_profile)
  account: User

  @OneToMany(() => CourseLike, (courseLike) => courseLike.student)
  likes: CourseLike[]

  @OneToOne(() => CourseProgress, (progress) => progress.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  progress: CourseProgress[]

  @OneToMany(() => StudentGoal, (goals) => goals.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  goals: StudentGoal[]

  @OneToMany(() => StudentProject, (studentProject) => studentProject.student)
  projects: StudentProject[]

  @OneToMany(() => StudentSocial, (studentSocial) => studentSocial.student)
  socials: StudentSocial[]

  @ManyToMany(() => School, (school) => school.students, {
    onDelete: 'CASCADE',
  })
  school: School[]

  @ManyToMany(() => Class, (schoolClass) => schoolClass.students)
  @JoinTable({ name: 'stuent_classes' })
  classes: Class[]

  @ManyToMany(() => Assigment, (assigment) => assigment.assignee_students, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'student_assigment' })
  assigments: Assigment[]

  @OneToMany(() => CourseRating, (rating) => rating.student)
  ratings: CourseRating[]

  @OneToMany(() => LessonLastSlide, (lessonSlides) => lessonSlides.user)
  last_slides: LessonLastSlide[]
}
