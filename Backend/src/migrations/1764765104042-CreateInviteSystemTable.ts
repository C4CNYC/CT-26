import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateInviteSystemTable1764765104042
  implements MigrationInterface
{
  name = 'CreateInviteSystemTable1764765104042'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invite-system" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid NOT NULL, "email" character varying, "organizationId" character varying, "schoolId" character varying, "classId" character varying, "type" character varying NOT NULL, "role" character varying NOT NULL, "code" character varying NOT NULL, "redirectUrl" character varying, "maxUses" integer NOT NULL DEFAULT '1', "uses" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "expiresAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6b7afea0094c4e9d60679a1f4a1" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "invite-system" ADD CONSTRAINT "FK_fdcac5fbd89c469e9260bbb335e" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invite-system" DROP CONSTRAINT "FK_fdcac5fbd89c469e9260bbb335e"`,
    )
    await queryRunner.query(`DROP TABLE "invite-system"`)
  }
}
