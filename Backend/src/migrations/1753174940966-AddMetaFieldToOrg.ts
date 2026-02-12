import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMetaFieldToOrg1753174940966 implements MigrationInterface {
  name = 'AddMetaFieldToOrg1753174940966'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "meta" json DEFAULT '{}'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "meta"`)
  }
}
