import { MigrationInterface, QueryRunner } from 'typeorm'

import {
  ForeignKeyDeleteRule,
  replaceForeignKey,
} from '../utils/migrations/replace-foreign-key'

// Production's delete rules, first added in the old backend (CT-Middleware, commit 8b6273b).
// Production already records this migration, so it only runs on databases built from CT-26.
const DELETE_RULES: ForeignKeyDeleteRule[] = [
  {
    table: 'lessons',
    constraint: 'FK_d858621aa37f9325bb186c9bc87',
    column: 'userId',
    references: 'users',
    onDelete: 'SET NULL',
  },
  {
    table: 'course_units',
    constraint: 'FK_9b522f4b50031eb0460db39934e',
    column: 'userId',
    references: 'users',
    onDelete: 'SET NULL',
  },
  {
    table: 'assigments',
    constraint: 'FK_2529f059707fbefb5252e001a2d',
    column: 'creatorId',
    references: 'users',
    onDelete: 'SET NULL',
  },
  {
    table: 'lessons-contents',
    constraint: 'FK_deb8a29eef376aab009eb7bffe3',
    column: 'creatorId',
    references: 'users',
    onDelete: 'SET NULL',
  },
  {
    table: 'users',
    constraint: 'FK_7857f65e94524a542ecb7de8f89',
    column: 'studentProfileId',
    references: 'students',
    onDelete: 'CASCADE',
  },
  {
    table: 'users',
    constraint: 'FK_073c98f1567647b4dcec431d147',
    column: 'activityId',
    references: 'user-activity',
    onDelete: 'CASCADE',
  },
  {
    table: 'users_schools',
    constraint: 'FK_7ea92212ec5ba33043f0ecd3222',
    column: 'userId',
    references: 'users',
    onDelete: 'CASCADE',
  },
  {
    table: 'class_mentors',
    constraint: 'FK_5ba31bded1dc7c0fd8220e2edbe',
    column: 'usersId',
    references: 'users',
    onDelete: 'CASCADE',
  },
  {
    table: 'lessons_authors_users',
    constraint: 'FK_9ed2137163223f971cab6dd5de8',
    column: 'usersId',
    references: 'users',
    onDelete: 'CASCADE',
  },
  {
    table: 'courses_classes_classes',
    constraint: 'FK_d8095732baf98ac1706d80f6ff4',
    column: 'classesId',
    references: 'classes',
    onDelete: 'CASCADE',
  },
  {
    table: 'stuent_classes',
    constraint: 'FK_d76397aa93f56b1c7e745d3a59f',
    column: 'classesId',
    references: 'classes',
    onDelete: 'CASCADE',
  },
  {
    table: 'lesson-content-files',
    constraint: 'FK_2beb098e9e18586fa24b0d392d3',
    column: 'lessonContentId',
    references: 'lessons-contents',
    onDelete: 'CASCADE',
  },
  // Not in the original migration, but production already has these two
  {
    table: 'student-lesson-files',
    constraint: 'FK_1e96f1a8991cd96aedce9ea76cc',
    column: 'lessonContentId',
    references: 'lessons-contents',
    onDelete: 'CASCADE',
  },
  {
    table: 'student-lesson-files',
    constraint: 'FK_70a18418c0c9b4b030f5124946d',
    column: 'lessonId',
    references: 'lessons',
    onDelete: 'CASCADE',
  },
]

export class AddCascadeDeletes1766400444631 implements MigrationInterface {
  name = 'AddCascadeDeletes1766400444631'

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
