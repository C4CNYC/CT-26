import { MigrationInterface, QueryRunner } from 'typeorm'

export class OrganizationSetting1733149028572 implements MigrationInterface {
  name = 'OrganizationSetting1733149028572'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "logo" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "min_logo" character varying`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."organization_home_page_type_enum" AS ENUM('custom', 'default', 'authorization')`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "home_page_type" "public"."organization_home_page_type_enum" NOT NULL DEFAULT 'default'`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('owner', 'admin', 'editor', 'manager', 'student', 'anonymous', 'super_admin')`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'manager'`,
    )
    await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum_old" AS ENUM('owner', 'admin', 'manager', 'student', 'editor', 'anonymous')`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'manager'`,
    )
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "home_page_type"`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."organization_home_page_type_enum"`,
    )
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "min_logo"`)
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "logo"`)
  }
}
