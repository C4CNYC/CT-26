import { uuid } from 'aws-sdk/clients/customerprofiles'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { Lesson } from '@/modules/core/lesson/lesson.entity'
import { Student } from '@/modules/core/student/student.entity'
import { BaseEntity } from '@/utils/base/base.entity'

const ALIAS = 'lesson-last-slide'

@Entity({ name: ALIAS })
export class LessonLastSlide extends BaseEntity {
  @Column({ type: 'integer', nullable: true })
  slideNumber: number

  @Column({ type: 'uuid', nullable: true })
  lessonId: uuid

  @Column({ type: 'uuid', nullable: true })
  studentId: uuid
  @ManyToOne(() => Lesson, (lesson) => lesson.last_slides)
  @JoinColumn({ name: 'lessonId' })
  public lesson: Lesson

  @ManyToOne(() => Student, (user) => user.last_slides)
  @JoinColumn({ name: 'studentId' })
  user: Student
}
