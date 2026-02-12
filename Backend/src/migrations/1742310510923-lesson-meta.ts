import { MigrationInterface, QueryRunner } from 'typeorm'

export class LessonMeta1742310510923 implements MigrationInterface {
  name = 'LessonMeta1742310510923'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lessons" ADD "meta" jsonb DEFAULT '{}'::jsonb`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "meta"`)
  }
}
