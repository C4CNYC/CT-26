import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnitBackgrounAssignmentTypes1727921418402
  implements MigrationInterface
{
  name = 'UnitBackgrounAssignmentTypes1727921418402'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."assigments_type_enum" RENAME TO "assigments_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."assigments_type_enum" AS ENUM('course', 'open_project', 'group_coding_project', 'review', 'exersize', 'research', 'my_creations')`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" ALTER COLUMN "type" TYPE "public"."assigments_type_enum" USING "type"::"text"::"public"."assigments_type_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."assigments_type_enum_old"`)
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD COLUMN "background" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."assigments_type_enum_old" AS ENUM('course', 'open_project', 'group_coding_project', 'review', 'exersize', 'research', 'custom_content', 'my_creations')`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" ALTER COLUMN "type" TYPE "public"."assigments_type_enum_old" USING "type"::"text"::"public"."assigments_type_enum_old"`,
    )
    await queryRunner.query(`DROP TYPE "public"."assigments_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."assigments_type_enum_old" RENAME TO "assigments_type_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_units" DROP COLUMN "background"`,
    )
  }
}
