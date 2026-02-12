import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLessonContentToEnvironmentTable1761896000001 implements MigrationInterface {
    name = 'CreateLessonContentToEnvironmentTable1761896000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lesson_content_to_environment" (
                "lessonContentId" uuid NOT NULL,
                "environmentId" uuid NOT NULL,
                "sort" double precision,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lesson_content_to_environment" PRIMARY KEY ("lessonContentId", "environmentId")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "lesson_content_to_environment" 
            ADD CONSTRAINT "FK_lesson_content_to_environment_lesson_content" 
            FOREIGN KEY ("lessonContentId") 
            REFERENCES "lessons-contents"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "lesson_content_to_environment" 
            ADD CONSTRAINT "FK_lesson_content_to_environment_environment" 
            FOREIGN KEY ("environmentId") 
            REFERENCES "environment"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_lesson_content_to_environment_lesson_content" 
            ON "lesson_content_to_environment" ("lessonContentId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_lesson_content_to_environment_environment" 
            ON "lesson_content_to_environment" ("environmentId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_lesson_content_to_environment_environment"`);
        await queryRunner.query(`DROP INDEX "IDX_lesson_content_to_environment_lesson_content"`);
        await queryRunner.query(`ALTER TABLE "lesson_content_to_environment" DROP CONSTRAINT "FK_lesson_content_to_environment_environment"`);
        await queryRunner.query(`ALTER TABLE "lesson_content_to_environment" DROP CONSTRAINT "FK_lesson_content_to_environment_lesson_content"`);
        await queryRunner.query(`DROP TABLE "lesson_content_to_environment"`);
    }
}