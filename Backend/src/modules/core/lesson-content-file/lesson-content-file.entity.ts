import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { LessonContent } from '../lesson-content/lesson-content.entity'

const ALIAS = 'lesson-content-files'

@Entity({ name: ALIAS })
export class LessonContentFile extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  extension: string

  @Column({ type: 'int', default: 0 })
  connection_order: number

  @Column({ type: 'varchar', nullable: true })
  preloaded_code: string

  @Column({ type: 'boolean', default: true })
  editable: boolean

  @Column({ type: 'boolean', default: false })
  hidden: boolean

  @Column({ type: 'boolean', default: true })
  active: boolean

  @ManyToOne(() => LessonContent, (lessonContent) => lessonContent.files, {
    onDelete: 'CASCADE',
  })
  lessonContent: LessonContent
}
