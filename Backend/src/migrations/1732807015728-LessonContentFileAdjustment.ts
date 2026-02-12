import { MigrationInterface, QueryRunner } from 'typeorm'

export class LessonContentFileAdjustment1732807015728
  implements MigrationInterface
{
  name = 'LessonContentFileAdjustment1732807015728'

  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(
      `ALTER TABLE "student-lesson-files" ADD "lessonContentId" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD CONSTRAINT "FK_dcc48c9a30a4c810a992542bb53" FOREIGN KEY ("discussionId") REFERENCES "lesson-content-thread-discussion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD CONSTRAINT "FK_e7ae443001c12348e4d7b71f234" FOREIGN KEY ("threadId") REFERENCES "lesson-content-thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-files" ADD CONSTRAINT "FK_1e96f1a8991cd96aedce9ea76cc" FOREIGN KEY ("lessonContentId") REFERENCES "lessons-contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student-lesson-files" DROP CONSTRAINT "FK_1e96f1a8991cd96aedce9ea76cc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP CONSTRAINT "FK_e7ae443001c12348e4d7b71f234"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP CONSTRAINT "FK_dcc48c9a30a4c810a992542bb53"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-files" DROP COLUMN "lessonContentId"`,
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
  }
}
