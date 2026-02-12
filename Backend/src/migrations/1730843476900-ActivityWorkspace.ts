import { MigrationInterface, QueryRunner } from 'typeorm'

export class ActivityWorkspace1730843476900 implements MigrationInterface {
  name = 'ActivityWorkspace1730843476900'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-activity" ADD "lastWorkspaceQuery" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-activity" DROP COLUMN "lastWorkspaceQuery"`,
    )
  }
}
