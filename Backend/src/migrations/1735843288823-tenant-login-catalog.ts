import { MigrationInterface, QueryRunner } from 'typeorm'

export class TenantLoginCatalog1735843288823 implements MigrationInterface {
  name = 'TenantLoginCatalog1735843288823'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."organization_home_page_type_enum" RENAME TO "organization_home_page_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."organization_home_page_type_enum" AS ENUM('custom', 'default', 'authorization', 'catalog')`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "home_page_type" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "home_page_type" TYPE "public"."organization_home_page_type_enum" USING "home_page_type"::"text"::"public"."organization_home_page_type_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "home_page_type" SET DEFAULT 'default'`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."organization_home_page_type_enum_old"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."organization_home_page_type_enum_old" AS ENUM('custom', 'default', 'authorization')`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "home_page_type" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "home_page_type" TYPE "public"."organization_home_page_type_enum_old" USING "home_page_type"::"text"::"public"."organization_home_page_type_enum_old"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "home_page_type" SET DEFAULT 'default'`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."organization_home_page_type_enum"`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."organization_home_page_type_enum_old" RENAME TO "organization_home_page_type_enum"`,
    )
  }
}
