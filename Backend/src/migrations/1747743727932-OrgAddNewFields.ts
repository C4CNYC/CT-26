import { MigrationInterface, QueryRunner } from 'typeorm'

export class OrgAddNewFields1747743727932 implements MigrationInterface {
  name = 'OrgAddNewFields1747743727932'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "student_count_current" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "student_count_expected" integer`,
    )
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "student_count_expected"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "student_count_current"`,
    )
  }
}
