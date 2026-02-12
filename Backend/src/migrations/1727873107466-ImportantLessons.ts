import { MigrationInterface, QueryRunner } from 'typeorm'

export class ImportantLessons1727873107466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the lesson with the specified ID
    await queryRunner.query(`INSERT INTO "lessons" ("id", "createdAt", "updatedAt", "active", "draft", "name", "auto_graded", "core", "type", "description", "tips", "duration", "independent", "head") VALUES
        ('1e550800-0000-0000-0000-000000000000',	'2024-09-01 11:02:35.619383+00',	'2024-09-01 11:02:34.427+00',	't',	't',	'My New Lesson',	't',	't',	'practical',	'My Lesson Description',	'{}',	NULL,	NULL,	NULL),
        ('2e550800-0000-0000-0000-000000000000',	'2024-09-08 13:42:14.570271+00',	'2024-09-08 13:42:14.570271+00',	't',	't',	'Ai lesson template',	't',	't',	'practical',	'Instructions for ai',	'{}',	'00:00:00',	NULL,	NULL),
        ('3e550800-0000-0000-0000-000000000000',	'2024-09-01 11:02:35.619+00',	'2024-09-25 20:31:39.658892+00',	't',	't',	'Ai lesson contents',	't',	't',	'practical',	'Contents to be filled by ai',	'{}',	NULL,	NULL,	NULL)
        ON CONFLICT (id) DO NOTHING
        `)
  }

  public async down(): Promise<void> {}
}
