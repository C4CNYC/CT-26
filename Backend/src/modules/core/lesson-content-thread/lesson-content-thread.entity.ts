import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { LessonContentThreadDiscussion } from '../lesson-content-thread-discussion/lesson-content-thread-discussion.entity'
import { StudentLessonFile } from '../student-lesson-file/student-lesson-file.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'lesson-content-thread'

@Entity({ name: ALIAS })
export class LessonContentThread extends BaseEntity {
  @Column({ type: 'varchar' })
  message: string

  @ManyToOne(() => Student, (student) => student.threads, {
    onDelete: 'CASCADE',
  })
  owner: Student

  @ManyToOne(() => StudentLessonFile, (student) => student.threads, {
    onDelete: 'CASCADE',
  })
  file: StudentLessonFile

  @OneToMany(
    () => LessonContentThreadDiscussion,
    (discussions) => discussions.thread,
    { onDelete: 'CASCADE' },
  )
  discussions: LessonContentThreadDiscussion[]
}
