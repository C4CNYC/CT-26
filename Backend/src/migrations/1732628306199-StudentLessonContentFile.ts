import { MigrationInterface, QueryRunner } from 'typeorm'

export class StudentLessonContentFile1732628306199
  implements MigrationInterface
{
  name = 'StudentLessonContentFile1732628306199'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."student-lesson-content-files_extension_enum" AS ENUM('js', 'css', 'html', 'json')`,
    )
    await queryRunner.query(
      `CREATE TABLE "student-lesson-content-files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "extension" "public"."student-lesson-content-files_extension_enum" NOT NULL, "body" character varying, "studentId" uuid, "lessonContentId" uuid, CONSTRAINT "PK_ea5be09e2a76025abd6cc32e5ac" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-content-files" ADD CONSTRAINT "FK_9ea44b185186093294756c6046e" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-content-files" ADD CONSTRAINT "FK_6a42d8c94fe5587b1021b1cbc6c" FOREIGN KEY ("lessonContentId") REFERENCES "lessons-contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student-lesson-content-files" DROP CONSTRAINT "FK_6a42d8c94fe5587b1021b1cbc6c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-content-files" DROP CONSTRAINT "FK_9ea44b185186093294756c6046e"`,
    )
    await queryRunner.query(`DROP TABLE "student-lesson-content-files"`)
    await queryRunner.query(
      `DROP TYPE "public"."student-lesson-content-files_extension_enum"`,
    )
  }
}
