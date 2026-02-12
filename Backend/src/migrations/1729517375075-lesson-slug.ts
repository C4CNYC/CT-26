import { MigrationInterface, QueryRunner } from 'typeorm'

export class LessonSlug1729517375075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lessons" ADD "slug" character varying `,
    )
    await queryRunner.query(`
        WITH numbered_rows AS (
            SELECT id, row_number() OVER () AS rownum
            FROM "lessons"
          )
          UPDATE "lessons"
          SET slug = 'slug-' || rownum
          FROM numbered_rows
          WHERE "lessons".id = numbered_rows.id;
        `)

    await queryRunner.query(
      `ALTER TABLE "lessons" ADD CONSTRAINT "UQ_ca2edfa23c965f9c435572a7de3" UNIQUE ("slug")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lessons" DROP CONSTRAINT "UQ_ca2edfa23c965f9c435572a7de3"`,
    )
    await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "slug"`)
  }
}
