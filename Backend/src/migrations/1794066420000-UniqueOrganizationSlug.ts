import { MigrationInterface, QueryRunner } from 'typeorm'

export class UniqueOrganizationSlug1794066420000 implements MigrationInterface {
  name = 'UniqueOrganizationSlug1794066420000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Slugs are matched case-insensitively, so no two organizations may share one in any case
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "organization_slug_lower_unique"
      ON "organization" (LOWER("slug"))
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "organization_slug_lower_unique"`,
    )
  }
}
