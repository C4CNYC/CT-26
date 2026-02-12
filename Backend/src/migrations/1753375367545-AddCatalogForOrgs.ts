import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCatalogForOrgs1753375367545 implements MigrationInterface {
  name = 'AddCatalogForOrgs1753375367545'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "catalog_course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "organization_id" uuid NOT NULL, "course_id" uuid NOT NULL, "is_show" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_dc342abc8fd12f033ec83f2e9cc" UNIQUE ("organization_id", "course_id"), CONSTRAINT "PK_e808855f29cec0bb5d64a3f80da" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "is_global" boolean NOT NULL DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "catalog_course" ADD CONSTRAINT "FK_b12a65ce100627c5903bea84322" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "catalog_course" ADD CONSTRAINT "FK_8d9bd34fb8683ad20e78d9c36b0" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "catalog_course" DROP CONSTRAINT "FK_8d9bd34fb8683ad20e78d9c36b0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "catalog_course" DROP CONSTRAINT "FK_b12a65ce100627c5903bea84322"`,
    )

    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "is_global"`)

    await queryRunner.query(`DROP TABLE "catalog_course"`)
  }
}
