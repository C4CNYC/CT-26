import { MigrationInterface, QueryRunner } from 'typeorm'

export class IntegrationTenantPublic1764805041579 implements MigrationInterface {
  name = 'IntegrationTenantPublic1764805041579'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add organization_id column (nullable initially)
    await queryRunner.query(`
      ALTER TABLE "integration"
      ADD COLUMN "organization_id" UUID
    `)

    // Add public column with default false
    await queryRunner.query(`
      ALTER TABLE "integration"
      ADD COLUMN "public" BOOLEAN NOT NULL DEFAULT FALSE
    `)

    // Get the oldest organization id
    const oldestOrg = await queryRunner.query(`
      SELECT id FROM "organization"
      ORDER BY "createdAt" ASC
      LIMIT 1
    `)

    const orgId = oldestOrg[0]?.id

    if (orgId) {
      // Update existing integrations to belong to the oldest organization and be public
      await queryRunner.query(`
        UPDATE "integration"
        SET "organization_id" = $1, "public" = TRUE
        WHERE "organization_id" IS NULL
      `, [orgId])
    }

    // Now make organization_id NOT NULL
    await queryRunner.query(`
      ALTER TABLE "integration"
      ALTER COLUMN "organization_id" SET NOT NULL
    `)

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "integration"
      ADD CONSTRAINT "FK_integration_organization"
      FOREIGN KEY ("organization_id")
      REFERENCES "organization"("id")
      ON DELETE CASCADE
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "integration"
      DROP CONSTRAINT "FK_integration_organization"
    `)

    // Drop columns
    await queryRunner.query(`
      ALTER TABLE "integration"
      DROP COLUMN "public"
    `)
    await queryRunner.query(`
      ALTER TABLE "integration"
      DROP COLUMN "organization_id"
    `)
  }
}