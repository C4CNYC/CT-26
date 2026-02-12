import { MigrationInterface, QueryRunner } from 'typeorm'

export class HomePageBody1734102620516 implements MigrationInterface {
  name = 'HomePageBody1734102620516'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "home_page_body" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "home_page_body"`,
    )
  }
}
