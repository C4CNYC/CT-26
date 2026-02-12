import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Lesson } from '../lesson/lesson.entity'
import { CourseUnit } from './course-unit.entity'

@Entity({ name: 'lesson_to_course_unit' /*"lessons_units_course_units"*/ })
export class LessonToCourseUnit {
  @PrimaryColumn()
  public courseUnitId: string

  @PrimaryColumn()
  public lessonId: string

  @Column({ nullable: true, type: 'float' })
  public sort: number

  @ManyToOne(() => CourseUnit, (courseUnit) => courseUnit.lessonToUnits, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'courseUnitId' })
  public courseUnit: CourseUnit

  @ManyToOne(() => Lesson, (lesson) => lesson.lessonToUnits, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId' })
  public lesson: Lesson
}
