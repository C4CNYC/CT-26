import { MigrationInterface, QueryRunner } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export class LessonShool1739972032192 implements MigrationInterface {
  name = 'LessonShool1739972032192'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions

    await queryRunner.query(`ALTER TABLE "lessons" ADD "schoolId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "lessons" ADD CONSTRAINT "FK_09e3205d41c5e8e1aaf60623ce4" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions

    await queryRunner.query(
      `ALTER TABLE "lessons" DROP CONSTRAINT "FK_09e3205d41c5e8e1aaf60623ce4"`,
    )
    await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "schoolId"`)
  }
}
