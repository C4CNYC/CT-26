import { MigrationInterface, QueryRunner } from 'typeorm'

import {
  ForeignKeyDeleteRule,
  replaceForeignKey,
} from '../utils/migrations/replace-foreign-key'

// Deleting a student takes their history with it, instead of being blocked by it
const DELETE_RULES: ForeignKeyDeleteRule[] = [
  {
    table: 'lesson-last-slide',
    constraint: 'FK_5536b98cc321a13ace98abe47c1',
    column: 'studentId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'student-goals',
    constraint: 'FK_3e29a107c8ac16558e6b04a61e4',
    column: 'studentId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'student-projects',
    constraint: 'FK_5533bfddfa73d9d43d41846084f',
    column: 'studentId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'student-socials',
    constraint: 'FK_ccd99dc4a8f2a01fd3385fd7315',
    column: 'studentId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'class-student-pending',
    constraint: 'FK_fdc08e139fbf948ffa409bc46fc',
    column: 'studentId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'student-lesson-content-files',
    constraint: 'FK_9ea44b185186093294756c6046e',
    column: 'studentId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'student-lesson-files',
    constraint: 'FK_1220caa99158a09980198857303',
    column: 'studentId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'lesson-content-thread',
    constraint: 'FK_b4ebddaa9963af13a2d3a93f169',
    column: 'ownerId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'lesson-content-thread',
    constraint: 'FK_817fddaa1986541ef1e2ea9cf41',
    column: 'fileId',
    references: 'student-lesson-files',
    onDelete: 'CASCADE',
  },
  {
    table: 'lesson-content-thread-discussion',
    constraint: 'FK_549fd73b32604ed7ed58d3cfd12',
    column: 'ownerId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'lesson-content-thread-discussion',
    constraint: 'FK_e7ae443001c12348e4d7b71f234',
    column: 'threadId',
    references: 'lesson-content-thread',
    onDelete: 'CASCADE',
  },
  {
    table: 'lesson-content-thread-discussion',
    constraint: 'FK_dcc48c9a30a4c810a992542bb53',
    column: 'discussionId',
    references: 'lesson-content-thread-discussion',
    onDelete: 'CASCADE',
  },
  {
    table: 'access-control',
    constraint: 'FK_b6dd6d9b205507697974bb8329e',
    column: 'user_id',
    references: 'users',
    onDelete: 'CASCADE',
  },
]

export class CascadeStudentHistoryDeletes1794600666000
  implements MigrationInterface
{
  name = 'CascadeStudentHistoryDeletes1794600666000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const rule of DELETE_RULES) {
      await replaceForeignKey(queryRunner, rule, rule.onDelete)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const rule of DELETE_RULES) {
      await replaceForeignKey(queryRunner, rule, 'NO ACTION')
    }
  }
}
