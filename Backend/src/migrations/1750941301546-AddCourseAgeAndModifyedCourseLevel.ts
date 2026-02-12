import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCourseAgeAndModifyedCourseLevel1750941301546
  implements MigrationInterface
{
  name = 'AddCourseAgeAndModifyedCourseLevel1750941301546'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "customLevel" character varying`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."courses_age_enum" AS ENUM('grade 1+', 'grade 2+', 'grade 3+', 'grade 4+', 'grade 5+', 'grade 6+', 'grade 7+', 'grade 8+', 'grade 9+', 'grade 10+', 'grade 11+', 'grade 12+', '18 & up')`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "age" "public"."courses_age_enum" NOT NULL DEFAULT 'grade 1+'`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "customAge" character varying`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."courses_level_enum" RENAME TO "courses_level_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."courses_level_enum" AS ENUM('rookie', 'beginner', 'intermediate', 'pro', 'ninja')`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "level" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "level" TYPE "public"."courses_level_enum" USING "level"::"text"::"public"."courses_level_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "level" SET DEFAULT 'beginner'`,
    )
    await queryRunner.query(`DROP TYPE "public"."courses_level_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."courses_level_enum_old" AS ENUM('beginner', 'intermediate', 'advanced')`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "level" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "level" TYPE "public"."courses_level_enum_old" USING "level"::"text"::"public"."courses_level_enum_old"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "level" SET DEFAULT 'beginner'`,
    )
    await queryRunner.query(`DROP TYPE "public"."courses_level_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."courses_level_enum_old" RENAME TO "courses_level_enum"`,
    )
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "customAge"`)
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "age"`)
    await queryRunner.query(`DROP TYPE "public"."courses_age_enum"`)
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "customLevel"`)
  }
}
