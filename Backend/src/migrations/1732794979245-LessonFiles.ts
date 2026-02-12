import { MigrationInterface, QueryRunner } from 'typeorm'

export class LessonFiles1732794979245 implements MigrationInterface {
  name = 'LessonFiles1732794979245'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP CONSTRAINT "FK_e7ae443001c12348e4d7b71f234"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP CONSTRAINT "FK_dcc48c9a30a4c810a992542bb53"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread" DROP CONSTRAINT "FK_817fddaa1986541ef1e2ea9cf41"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."student-lesson-files_extension_enum" AS ENUM('js', 'css', 'html', 'json')`,
    )
    await queryRunner.query(
      `CREATE TABLE "student-lesson-files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "extension" "public"."student-lesson-files_extension_enum" NOT NULL, "body" character varying, "studentId" uuid, "lessonId" uuid, CONSTRAINT "PK_2cd7824ebf6e3ab6baf39252663" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP COLUMN "threadId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP COLUMN "discussionId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD "discussionId" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD "threadId" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD CONSTRAINT "FK_dcc48c9a30a4c810a992542bb53" FOREIGN KEY ("discussionId") REFERENCES "lesson-content-thread-discussion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD CONSTRAINT "FK_e7ae443001c12348e4d7b71f234" FOREIGN KEY ("threadId") REFERENCES "lesson-content-thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread" ADD CONSTRAINT "FK_817fddaa1986541ef1e2ea9cf41" FOREIGN KEY ("fileId") REFERENCES "student-lesson-files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-files" ADD CONSTRAINT "FK_1220caa99158a09980198857303" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-files" ADD CONSTRAINT "FK_70a18418c0c9b4b030f5124946d" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student-lesson-files" DROP CONSTRAINT "FK_70a18418c0c9b4b030f5124946d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-files" DROP CONSTRAINT "FK_1220caa99158a09980198857303"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread" DROP CONSTRAINT "FK_817fddaa1986541ef1e2ea9cf41"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP CONSTRAINT "FK_e7ae443001c12348e4d7b71f234"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP CONSTRAINT "FK_dcc48c9a30a4c810a992542bb53"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP COLUMN "threadId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP COLUMN "discussionId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD "discussionId" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD "threadId" uuid`,
    )
    await queryRunner.query(`DROP TABLE "student-lesson-files"`)
    await queryRunner.query(
      `DROP TYPE "public"."student-lesson-files_extension_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread" ADD CONSTRAINT "FK_817fddaa1986541ef1e2ea9cf41" FOREIGN KEY ("fileId") REFERENCES "student-lesson-content-files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD CONSTRAINT "FK_dcc48c9a30a4c810a992542bb53" FOREIGN KEY ("discussionId") REFERENCES "lesson-content-thread-discussion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD CONSTRAINT "FK_e7ae443001c12348e4d7b71f234" FOREIGN KEY ("threadId") REFERENCES "lesson-content-thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
