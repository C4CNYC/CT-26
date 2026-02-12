import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Assigment } from '../assigment/assigment.entity'
import { Lesson } from '../lesson/lesson.entity'

const ALIAS = 'skills'

@Entity({ name: ALIAS })
export class Skill extends BaseEntity {
  @Column({ type: 'boolean', default: true })
  active: boolean

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar' })
  description: string

  @ManyToMany(() => Lesson, (lesson) => lesson.skills, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'lesson-skills' })
  lessons: Lesson[]

  @ManyToMany(() => Assigment, (assigment) => assigment.skill_tags, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'skill_assigment' })
  assigments: Assigment[]
}
