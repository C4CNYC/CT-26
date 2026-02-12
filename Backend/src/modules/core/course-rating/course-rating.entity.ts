import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Course } from '../course/course.entity'
import { Student } from '../student/student.entity'

const ALIAS = 'course_rating'

@Entity({ name: ALIAS })
export class CourseRating extends BaseEntity {
  @ManyToOne(() => Course, (course) => course.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  course: Course

  @Column({ type: 'int', nullable: true })
  rating: number

  @ManyToOne(() => Student, (student) => student.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  student: Student
}
