import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { Lesson } from '../lesson/lesson.entity'

@Entity({ name: 'lesson_to_environment' })
export class LessonToEnvironment {
  @PrimaryColumn()
  public lessonId: string

  @PrimaryColumn()
  public environmentId: string

  @Column({ nullable: true, type: 'float' })
  public sort: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt: Date

  @ManyToOne(() => Lesson, (lesson) => lesson.lessonToEnvironments, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId' })
  public lesson: Lesson

  @ManyToOne(() => Environment, (environment) => environment.lessonToEnvironments, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'environmentId' })
  public environment: Environment
}