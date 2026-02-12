import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLessonToEnvironmentTable1761896000000 implements MigrationInterface {
    name = 'CreateLessonToEnvironmentTable1761896000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lesson_to_environment" (
                "lessonId" uuid NOT NULL,
                "environmentId" uuid NOT NULL,
                "sort" double precision,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lesson_to_environment" PRIMARY KEY ("lessonId", "environmentId")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "lesson_to_environment" 
            ADD CONSTRAINT "FK_lesson_to_environment_lesson" 
            FOREIGN KEY ("lessonId") 
            REFERENCES "lessons"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "lesson_to_environment" 
            ADD CONSTRAINT "FK_lesson_to_environment_environment" 
            FOREIGN KEY ("environmentId") 
            REFERENCES "environment"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_lesson_to_environment_lesson" 
            ON "lesson_to_environment" ("lessonId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_lesson_to_environment_environment" 
            ON "lesson_to_environment" ("environmentId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_lesson_to_environment_environment"`);
        await queryRunner.query(`DROP INDEX "IDX_lesson_to_environment_lesson"`);
        await queryRunner.query(`ALTER TABLE "lesson_to_environment" DROP CONSTRAINT "FK_lesson_to_environment_environment"`);
        await queryRunner.query(`ALTER TABLE "lesson_to_environment" DROP CONSTRAINT "FK_lesson_to_environment_lesson"`);
        await queryRunner.query(`DROP TABLE "lesson_to_environment"`);
    }
}