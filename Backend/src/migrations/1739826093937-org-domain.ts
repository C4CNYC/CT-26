import { MigrationInterface, QueryRunner } from 'typeorm'

export class OrgDomain1739826093937 implements MigrationInterface {
  name = 'OrgDomain1739826093937'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "domain" character varying `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "domain"`)
  }
}
