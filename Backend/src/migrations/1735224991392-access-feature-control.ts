import { MigrationInterface, QueryRunner } from 'typeorm'

export class AccessFeatureControl1735224991392 implements MigrationInterface {
  name = 'AccessFeatureControl1735224991392'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "access-control" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "feature" character varying NOT NULL, "maxUsageCount" integer NOT NULL DEFAULT '0', "user_id" uuid, CONSTRAINT "PK_9e65e85a51d3a1d3d3e2f1330a6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "access-control" ADD CONSTRAINT "FK_b6dd6d9b205507697974bb8329e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access-control" DROP CONSTRAINT "FK_b6dd6d9b205507697974bb8329e"`,
    )
    await queryRunner.query(`DROP TABLE "access-control"`)
  }
}
