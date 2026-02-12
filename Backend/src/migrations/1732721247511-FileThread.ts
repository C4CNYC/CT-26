import { MigrationInterface, QueryRunner } from 'typeorm'

export class FileThread1732721247511 implements MigrationInterface {
  name = 'FileThread1732721247511'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lesson-content-thread-discussion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "message" character varying NOT NULL, "discussionId" uuid, "ownerId" uuid, CONSTRAINT "PK_36955cc553a0df86de8c0e564c5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson-content-thread" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "message" character varying NOT NULL, "ownerId" uuid, "fileId" uuid, CONSTRAINT "PK_70527e800fc85f1194b1096dfec" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "lesson-content-thread-discussion" ADD CONSTRAINT "FK_549fd73b32604ed7ed58d3cfd12" FOREIGN KEY ("ownerId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" ADD CONSTRAINT "FK_e7ae443001c12348e4d7b71f234" FOREIGN KEY ("threadId") REFERENCES "lesson-content-thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread" ADD CONSTRAINT "FK_b4ebddaa9963af13a2d3a93f169" FOREIGN KEY ("ownerId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread" ADD CONSTRAINT "FK_817fddaa1986541ef1e2ea9cf41" FOREIGN KEY ("fileId") REFERENCES "student-lesson-content-files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread" DROP CONSTRAINT "FK_817fddaa1986541ef1e2ea9cf41"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread" DROP CONSTRAINT "FK_b4ebddaa9963af13a2d3a93f169"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP CONSTRAINT "FK_e7ae443001c12348e4d7b71f234"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-content-thread-discussion" DROP CONSTRAINT "FK_549fd73b32604ed7ed58d3cfd12"`,
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
    await queryRunner.query(`DROP TABLE "lesson-content-thread"`)
    await queryRunner.query(`DROP TABLE "lesson-content-thread-discussion"`)
  }
}
