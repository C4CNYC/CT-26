import { MigrationInterface, QueryRunner } from 'typeorm'

export class LessonContentFile1732632303954 implements MigrationInterface {
  name = 'LessonContentFile1732632303954'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."lesson-content-files_extension_enum" AS ENUM('js', 'css', 'html', 'json')`,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson-content-files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "extension" "public"."lesson-content-files_extension_enum" NOT NULL, "connection_order" integer NOT NULL DEFAULT '0', "preloaded_code" character varying, "editable" boolean NOT NULL DEFAULT true, "hidden" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT true, "lessonContentId" uuid, CONSTRAINT "PK_72c8b97e18b490cf2dcfea3020f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-files" ADD CONSTRAINT "FK_2beb098e9e18586fa24b0d392d3" FOREIGN KEY ("lessonContentId") REFERENCES "lessons-contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson-content-files" DROP CONSTRAINT "FK_2beb098e9e18586fa24b0d392d3"`,
    )
    await queryRunner.query(`DROP TABLE "lesson-content-files"`)
    await queryRunner.query(
      `DROP TYPE "public"."lesson-content-files_extension_enum"`,
    )
  }
}
