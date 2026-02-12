import { MigrationInterface, QueryRunner } from 'typeorm'

export class OrganizationFavicon1733232969154 implements MigrationInterface {
  name = 'OrganizationFavicon1733232969154'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "favicon" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "favicon"`)
  }
}
