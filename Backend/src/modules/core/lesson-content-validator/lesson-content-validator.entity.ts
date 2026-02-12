import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { LessonContent } from '../lesson-content/lesson-content.entity'

const ALIAS = 'lessons-content-validator'

@Entity({ name: ALIAS })
export class LessonContentValidator extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  regex: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'varchar', nullable: true })
  type: string

  @ManyToOne(
    () => LessonContent,
    (lesson_content) => lesson_content.validations,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  lesson_content: LessonContent
}
