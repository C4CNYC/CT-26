import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCourseAndCourseUnitFieldsForCatalog1751558409826
  implements MigrationInterface
{
  name = 'AddCourseAndCourseUnitFieldsForCatalog1751558409826'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "audience" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "for_teachers" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "teacher_forum" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "lesson_plans" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "teacher_slides" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_units" DROP COLUMN "teacher_slides"`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" DROP COLUMN "lesson_plans"`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" DROP COLUMN "teacher_forum"`,
    )
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "for_teachers"`)
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "audience"`)
  }
}
