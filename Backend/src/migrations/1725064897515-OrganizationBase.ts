import { MigrationInterface, QueryRunner } from 'typeorm'

export class OrganizationBase1725064897515 implements MigrationInterface {
  name = 'OrganizationBase1725064897515'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "schools" ADD "organizationId" uuid`)
    await queryRunner.query(`ALTER TABLE "users" ADD "organizationId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "schools" ADD CONSTRAINT "FK_42ef534f0b1efdbc6aece928cdd" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979"`,
    )
    await queryRunner.query(
      `ALTER TABLE "schools" DROP CONSTRAINT "FK_42ef534f0b1efdbc6aece928cdd"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organizationId"`)
    await queryRunner.query(
      `ALTER TABLE "schools" DROP COLUMN "organizationId"`,
    )
    await queryRunner.query(`DROP TABLE "organization"`)
  }
}
