import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { LessonContentThread } from '../lesson-content-thread/lesson-content-thread.entity'
import { LessonContent } from '../lesson-content/lesson-content.entity'
import { Lesson } from '../lesson/lesson.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'student-lesson-files'

@Entity({ name: ALIAS })
export class StudentLessonFile extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  extension: string

  @Column({ type: 'varchar', nullable: true })
  body: string

  @ManyToOne(() => Student, (student) => student.lessonContentFiles, {
    onDelete: 'CASCADE',
  })
  student: Student

  @ManyToOne(() => Lesson, (lesson) => lesson.studentFiles, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  lesson: Lesson

  @ManyToOne(() => LessonContent, (lesson) => lesson.studentFiles, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  lessonContent: LessonContent

  @OneToMany(() => LessonContentThread, (thread) => thread.file, {
    onDelete: 'CASCADE',
  })
  threads: LessonContentThread[]
}
