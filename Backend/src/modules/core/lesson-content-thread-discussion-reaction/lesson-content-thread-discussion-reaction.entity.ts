import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { LessonContentThreadDiscussion } from '../lesson-content-thread-discussion/lesson-content-thread-discussion.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'lesson-content-thread-discussion'

@Entity({ name: ALIAS })
export class LessonContentThreadDiscussionReaction extends BaseEntity {
  @Column({ type: 'varchar' })
  message: string

  @ManyToOne(
    () => LessonContentThreadDiscussion,
    (discussion) => discussion.reactions,
    { onDelete: 'CASCADE' },
  )
  discussion: LessonContentThreadDiscussion

  @ManyToOne(() => Student, (student) => student.reactions, {
    onDelete: 'CASCADE',
  })
  owner: Student
}
