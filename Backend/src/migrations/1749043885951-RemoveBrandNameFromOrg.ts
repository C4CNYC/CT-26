import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveBrandNameFromOrg1749043885951 implements MigrationInterface {
  name = 'RemoveBrandNameFromOrg1749043885951'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "brandName"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "brandName" character varying`,
    )
  }
}
