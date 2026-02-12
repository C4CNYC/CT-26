import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMetaFieldToModule1752672721959 implements MigrationInterface {
  name = 'AddMetaFieldToModule1752672721959'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "meta" jsonb DEFAULT '{}'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "meta"`)
  }
}
