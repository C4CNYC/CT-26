import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDescriptionTypeToLessonContentValidator1755840637576
  implements MigrationInterface
{
  public async up(query_runner: QueryRunner): Promise<void> {
    await query_runner.query(`
      ALTER TABLE "lessons-content-validator" 
      ADD COLUMN "description" character varying,
      ADD COLUMN "type" character varying
    `)
  }

  public async down(query_runner: QueryRunner): Promise<void> {
    await query_runner.query(`
      ALTER TABLE "lessons-content-validator" 
      DROP COLUMN "description",
      DROP COLUMN "type"
    `)
  }
}
