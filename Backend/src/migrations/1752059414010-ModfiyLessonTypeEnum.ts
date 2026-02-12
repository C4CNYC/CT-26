import { MigrationInterface, QueryRunner } from 'typeorm'

export class ModfiyLessonTypeEnum1752059414010 implements MigrationInterface {
  name = 'ModfiyLessonTypeEnum1752059414010'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."lessons_type_enum" RENAME TO "lessons_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons_type_enum" AS ENUM('practical', 'exercise', 'start_project', 'part_project', 'open_project', 'quiz', 'other')`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "type" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "type" TYPE "public"."lessons_type_enum" USING "type"::"text"::"public"."lessons_type_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "type" SET DEFAULT 'practical'`,
    )
    await queryRunner.query(`DROP TYPE "public"."lessons_type_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."lessons_type_enum_old" AS ENUM('practical', 'exercise', 'quiz', 'open_project')`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "type" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "type" TYPE "public"."lessons_type_enum_old" USING "type"::"text"::"public"."lessons_type_enum_old"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "type" SET DEFAULT 'practical'`,
    )
    await queryRunner.query(`DROP TYPE "public"."lessons_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."lessons_type_enum_old" RENAME TO "lessons_type_enum"`,
    )
  }
}
