import type { UIMessage } from 'ai'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Lesson } from '../lesson/lesson.entity'
import { User } from '../user/user.entity'

const ALIAS = 'lesson-chat-messages'

@Entity({ name: ALIAS })
export class LessonChatMessage extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  lessonId: string

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson

  @Column({ type: 'uuid', nullable: true })
  userId: string | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null

  @Column({ type: 'jsonb' })
  message: UIMessage
}
