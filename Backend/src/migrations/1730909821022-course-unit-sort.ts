import { MigrationInterface, QueryRunner } from 'typeorm'

export class CourseUnitSort1730909821022 implements MigrationInterface {
  name = 'CourseUnitSort1730909821022'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "sort" integer NOT NULL DEFAULT '0'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "sort"`)
  }
}
