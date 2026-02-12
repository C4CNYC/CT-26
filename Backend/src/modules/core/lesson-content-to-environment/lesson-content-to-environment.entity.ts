import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { LessonContent } from '../lesson-content/lesson-content.entity'

@Entity({ name: 'lesson_content_to_environment' })
export class LessonContentToEnvironment {
  @PrimaryColumn()
  public lessonContentId: string

  @PrimaryColumn()
  public environmentId: string

  @Column({ nullable: true, type: 'float' })
  public sort: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt: Date

  @ManyToOne(() => LessonContent, (lessonContent) => lessonContent.lessonContentToEnvironments, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonContentId' })
  public lessonContent: LessonContent

  @ManyToOne(() => Environment, (environment) => environment.lessonContentToEnvironments, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'environmentId' })
  public environment: Environment
}