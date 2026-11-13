import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { LessonContentThreadDiscussionReaction } from '../lesson-content-thread-discussion-reaction/lesson-content-thread-discussion-reaction.entity'
import { LessonContentThread } from '../lesson-content-thread/lesson-content-thread.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'lesson-content-thread-discussion'

@Entity({ name: ALIAS })
export class LessonContentThreadDiscussion extends BaseEntity {
  @Column({ type: 'varchar' })
  message: string

  @ManyToOne(() => LessonContentThread, (thread) => thread.discussions, {
    onDelete: 'CASCADE',
  })
  thread: LessonContentThread

  @ManyToOne(() => Student, (student) => student.discussions, {
    onDelete: 'CASCADE',
  })
  owner: Student

  @OneToMany(
    () => LessonContentThreadDiscussionReaction,
    (reaction) => reaction.discussion,
    { onDelete: 'CASCADE' },
  )
  reactions: LessonContentThreadDiscussionReaction[]
}
