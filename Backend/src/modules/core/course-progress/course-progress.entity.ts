/** @format */
import { Column, Entity, ManyToMany, OneToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { LessonContent } from '../lesson-content/lesson-content.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'course-progress'

@Entity({ name: ALIAS })
export class CourseProgress extends BaseEntity {
  @OneToOne(() => Student, (student) => student.progress)
  student: Student

  @ManyToMany(() => LessonContent, (lesson) => lesson.progress, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  completed_chalanges: LessonContent[]

  @Column({ type: 'json', nullable: true, default: { step_ids: [], body: '' } })
  progress_meta: { [key: string]: string | number }
}
