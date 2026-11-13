import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateLessonChatMessage1794249787555
  implements MigrationInterface
{
  name = 'CreateLessonChatMessage1794249787555'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lesson-chat-messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lessonId" uuid NOT NULL, "userId" uuid, "message" jsonb NOT NULL, CONSTRAINT "PK_5388870f79a719e083b11bb9dd9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8229a513d8b59df3ca054c8462" ON "lesson-chat-messages" ("lessonId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-chat-messages" ADD CONSTRAINT "FK_8229a513d8b59df3ca054c8462f" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-chat-messages" ADD CONSTRAINT "FK_7be7b7bf0683bd329ba9663b885" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson-chat-messages" DROP CONSTRAINT "FK_7be7b7bf0683bd329ba9663b885"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-chat-messages" DROP CONSTRAINT "FK_8229a513d8b59df3ca054c8462f"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8229a513d8b59df3ca054c8462"`,
    )
    await queryRunner.query(`DROP TABLE "lesson-chat-messages"`)
  }
}
