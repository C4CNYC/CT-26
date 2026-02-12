import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAuthorsForCoureUnit1751101763695 implements MigrationInterface {
  name = 'AddAuthorsForCoureUnit1751101763695'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "course-unit-author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying, "about" character varying, "linkedin" character varying, "email" character varying NOT NULL, "avatar" character varying, "courseUnitId" uuid, CONSTRAINT "PK_64a8855a184a718e2d8bf6a57a5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "course-unit-author" ADD CONSTRAINT "FK_58a2cd3f593c0be4536e1a7e76b" FOREIGN KEY ("courseUnitId") REFERENCES "course_units"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course-unit-author" DROP CONSTRAINT "FK_58a2cd3f593c0be4536e1a7e76b"`,
    )
  }
}
