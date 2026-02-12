import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntity } from '../../../utils/base/base.entity'
import { Assigment } from '../assigment/assigment.entity'

const ALIAS = 'code-assignment'

@Entity({ name: ALIAS })
export class CodeAssignment extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', default: 'javascript' })
  language: string

  @Column({ type: 'json', nullable: true })
  body: Record<string, unknown>

  @OneToMany(() => Assigment, (assignment) => assignment.code_assignment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assigments: Assigment
}
