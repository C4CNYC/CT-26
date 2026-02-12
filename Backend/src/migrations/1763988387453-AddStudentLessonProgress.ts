import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddStudentLessonProgress1763988387453
  implements MigrationInterface
{
  name = 'AddStudentLessonProgress1763988387453'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student-lesson-progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "studentId" character varying, "lessonId" uuid, "completedAt" TIMESTAMP NOT NULL DEFAULT now(), "isVisited" boolean NOT NULL DEFAULT false, "visitedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b7604dab70968998e0a2ea069c9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-lesson-progress" ADD CONSTRAINT "FK_d82cbf478dffbcc2db59693debc" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student-lesson-progress" DROP CONSTRAINT "FK_d82cbf478dffbcc2db59693debc"`,
    )
    await queryRunner.query(`DROP TABLE "student-lesson-progress"`)
  }
}
