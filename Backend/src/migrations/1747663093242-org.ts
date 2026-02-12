import { MigrationInterface, QueryRunner } from 'typeorm'

export class Org1747663093242 implements MigrationInterface {
  name = 'Org1747663093242'


  public async up(queryRunner: QueryRunner): Promise<void> { 

    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "domain" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "city" character varying`,
    )
    await queryRunner.query(`ALTER TABLE "organization" ADD "note" text`)
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "subdomain" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "org_type" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "country" character varying`,
    )
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> { 

    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "country"`)
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "org_type"`)
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "subdomain"`,
    )
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "note"`)
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "city"`)
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "domain" SET NOT NULL`,
    )
  }
}
