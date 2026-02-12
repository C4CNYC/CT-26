import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUnitFields1750953652174 implements MigrationInterface {
  name = 'AddUnitFields1750953652174'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."course_units_level_enum" AS ENUM('rookie', 'beginner', 'intermediate', 'pro', 'ninja')`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "level" "public"."course_units_level_enum" NOT NULL DEFAULT 'beginner'`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "customLevel" character varying`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."course_units_age_enum" AS ENUM('grade 1+', 'grade 2+', 'grade 3+', 'grade 4+', 'grade 5+', 'grade 6+', 'grade 7+', 'grade 8+', 'grade 9+', 'grade 10+', 'grade 11+', 'grade 12+', '18 & up')`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "age" "public"."course_units_age_enum" NOT NULL DEFAULT 'grade 1+'`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "customAge" character varying`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."course_units_grading_enum" AS ENUM('auto-graded', 'manual-graded', 'mixed-graded')`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "grading" "public"."course_units_grading_enum" NOT NULL DEFAULT 'auto-graded'`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "brief" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD "audience" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "audience"`)
    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "brief"`)
    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "grading"`)
    await queryRunner.query(`DROP TYPE "public"."course_units_grading_enum"`)
    await queryRunner.query(
      `ALTER TABLE "course_units" DROP COLUMN "customAge"`,
    )
    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "age"`)
    await queryRunner.query(`DROP TYPE "public"."course_units_age_enum"`)
    await queryRunner.query(
      `ALTER TABLE "course_units" DROP COLUMN "customLevel"`,
    )
    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "level"`)
    await queryRunner.query(`DROP TYPE "public"."course_units_level_enum"`)
  }
}
