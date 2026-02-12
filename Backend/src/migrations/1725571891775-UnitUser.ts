import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnitUser1725571891775 implements MigrationInterface {
  name = 'UnitUser1725571891775'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course_units" ADD "userId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD CONSTRAINT "FK_9b522f4b50031eb0460db39934e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_units" DROP CONSTRAINT "FK_9b522f4b50031eb0460db39934e"`,
    )
    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "userId"`)
  }
}
