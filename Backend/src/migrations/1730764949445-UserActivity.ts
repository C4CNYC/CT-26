import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserActivity1730764949445 implements MigrationInterface {
  name = 'UserActivity1730764949445'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user-activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastActiveTribeId" uuid, CONSTRAINT "PK_7b25d839dc1c365992a09c46186" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "users" ADD "activityId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_073c98f1567647b4dcec431d147" UNIQUE ("activityId")`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."lessons-contents_type_enum" RENAME TO "lessons-contents_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons-contents_type_enum" AS ENUM('editable', 'slides', 'code', 'tinymce')`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" ALTER COLUMN "type" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" ALTER COLUMN "type" TYPE "public"."lessons-contents_type_enum" USING "type"::"text"::"public"."lessons-contents_type_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" ALTER COLUMN "type" SET DEFAULT 'editable'`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."lessons-contents_type_enum_old"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "slug" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user-activity" ADD CONSTRAINT "FK_1fb8ec1d0766fad8e1bfd10abe3" FOREIGN KEY ("lastActiveTribeId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_073c98f1567647b4dcec431d147" FOREIGN KEY ("activityId") REFERENCES "user-activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_073c98f1567647b4dcec431d147"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user-activity" DROP CONSTRAINT "FK_1fb8ec1d0766fad8e1bfd10abe3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "slug" DROP NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons-contents_type_enum_old" AS ENUM('editable', 'slides', 'code')`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" ALTER COLUMN "type" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" ALTER COLUMN "type" TYPE "public"."lessons-contents_type_enum_old" USING "type"::"text"::"public"."lessons-contents_type_enum_old"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" ALTER COLUMN "type" SET DEFAULT 'editable'`,
    )
    await queryRunner.query(`DROP TYPE "public"."lessons-contents_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."lessons-contents_type_enum_old" RENAME TO "lessons-contents_type_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_073c98f1567647b4dcec431d147"`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activityId"`)
    await queryRunner.query(`DROP TABLE "user-activity"`)
  }
}
