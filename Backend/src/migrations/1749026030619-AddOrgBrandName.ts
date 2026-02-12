import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOrgBrandName1749026030619 implements MigrationInterface {
  name = 'AddOrgBrandName1749026030619'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "brandName" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "brandName"`,
    )
  }
}
