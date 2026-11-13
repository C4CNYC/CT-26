/** @format */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import { User } from '@/modules/core/user/user.entity'

import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { BaseEntity } from '../../../utils/base/base.entity'
import { CourseProgress } from '../course-progress/course-progress.entity'
import { LessonContentFile } from '../lesson-content-file/lesson-content-file.entity'
import { LessonContentToEnvironment } from '../lesson-content-to-environment/lesson-content-to-environment.entity'
import { LessonContentValidator } from '../lesson-content-validator/lesson-content-validator.entity'
import { Lesson } from '../lesson/lesson.entity'
import { StudentLessonFile } from '../student-lesson-file/student-lesson-file.entity'
import { LessonContentComplexity } from './enums/lesson-content-complexity.enums'
import { LessonContentType } from './enums/lesson-content-type.enums'

const ALIAS = 'lessons-contents'

@Entity({ name: ALIAS })
export class LessonContent extends BaseEntity {
  @Column({
    type: 'varchar', // Changed from 'enum' to 'varchar'
    default: LessonContentType.Editable,
  })
  type: string // Changed from LessonContentType to string

  @Column({ type: 'varchar', nullable: true })
  slug: string

  @Column({ type: 'varchar', nullable: true })
  title: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'varchar', nullable: true })
  cover: string

  @Column({
    type: 'enum',
    enum: LessonContentComplexity,
    default: LessonContentComplexity.Beginner,
  })
  complexity: LessonContentComplexity

  @Column({ type: 'json', nullable: true })
  body: Record<string, unknown>

  @Column({ type: 'boolean', default: false })
  active: boolean

  @Column({ type: 'boolean', default: true })
  draft: boolean

  @Column({ type: 'varchar', nullable: true })
  solution_body: string

  @Column({ type: 'varchar', nullable: true })
  preload_body: string

  @Column({ type: 'varchar', nullable: true })
  tips: string

  @Column({ type: 'varchar', array: true, default: [] })
  tags: string[]

  @Column({ type: 'json', nullable: true, default: {} })
  meta: { [key: string]: string | number }

  @Column({ type: 'varchar', nullable: true })
  bg_color: string

  @OneToMany(
    () => LessonContentValidator,
    (validator) => validator.lesson_content,
  )
  validations: LessonContentValidator[]

  @ManyToOne(() => User, (user) => user.lesson_contents, {
    onDelete: 'SET NULL',
  })
  creator: User

  @ManyToOne(() => Lesson, (lesson) => lesson.contents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  lesson: Lesson

  @OneToMany(
    () => StudentLessonFile,
    (studentLessonFile) => studentLessonFile.lesson,
    { onDelete: 'CASCADE' },
  )
  studentFiles: StudentLessonFile[]

  @OneToMany(() => LessonContentFile, (file) => file.lessonContent, {
    onDelete: 'CASCADE',
  })
  files: LessonContentFile[]

  @ManyToMany(
    () => CourseProgress,
    (progress) => progress.completed_chalanges,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinTable({ name: 'progress_lesson_complete' })
  progress: CourseProgress[]

  @ManyToMany(() => Environment, (environment) => environment.lessonContents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'lesson_content_to_environment',
    joinColumn: { name: 'lessonContentId' },
    inverseJoinColumn: { name: 'environmentId' },
  })
  environments: Environment[]

  @OneToMany(
    () => LessonContentToEnvironment,
    (lessonContentToEnvironment) => lessonContentToEnvironment.lessonContent,
  )
  lessonContentToEnvironments: LessonContentToEnvironment[]
}
