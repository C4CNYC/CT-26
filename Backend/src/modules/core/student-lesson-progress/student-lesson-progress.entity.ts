import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Lesson } from '../lesson/lesson.entity'

@Entity('student-lesson-progress')
export class StudentLessonProgress extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  studentId: string

  @Column({ type: 'varchar', nullable: true })
  lessonId: string

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson

  @CreateDateColumn()
  completedAt: Date

  @Column({ type: 'boolean', default: false })
  isVisited: boolean

  @Column({ type: 'timestamptz', nullable: true })
  visitedAt: Date | null
}
