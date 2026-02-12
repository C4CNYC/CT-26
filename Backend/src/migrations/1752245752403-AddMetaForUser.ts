import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMetaForUser1752245752403 implements MigrationInterface {
  name = 'AddMetaForUser1752245752403'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "meta" jsonb DEFAULT '{}'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "meta"`)
  }
}
