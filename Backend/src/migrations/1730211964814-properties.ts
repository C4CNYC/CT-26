import { MigrationInterface, QueryRunner } from 'typeorm'

export class Properties1730211964814 implements MigrationInterface {
  name = 'Properties1730211964814'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "entityType" character varying(50) NOT NULL, "entityId" character varying(100) NOT NULL, "propertyName" character varying(100) NOT NULL, "propertyValue" text, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "properties"`)
  }
}
