import { MigrationInterface, QueryRunner } from 'typeorm'

export class FileExtensionToString1753364235603 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Convert extension column in lesson-content-files table
    await queryRunner.query(`
      ALTER TABLE "lesson-content-files" 
      ADD COLUMN "extension_new" character varying
    `);

    await queryRunner.query(`
      UPDATE "lesson-content-files"
      SET "extension_new" = "extension"::text
    `);

    await queryRunner.query(`
      ALTER TABLE "lesson-content-files" 
      DROP COLUMN "extension"
    `);

    await queryRunner.query(`
      ALTER TABLE "lesson-content-files" 
      RENAME COLUMN "extension_new" TO "extension"
    `);

    // Convert extension column in student-lesson-files table
    await queryRunner.query(`
      ALTER TABLE "student-lesson-files" 
      ADD COLUMN "extension_new" character varying
    `);

    await queryRunner.query(`
      UPDATE "student-lesson-files"
      SET "extension_new" = "extension"::text
    `);

    await queryRunner.query(`
      ALTER TABLE "student-lesson-files" 
      DROP COLUMN "extension"
    `);

    await queryRunner.query(`
      ALTER TABLE "student-lesson-files" 
      RENAME COLUMN "extension_new" TO "extension"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes in lesson-content-files table
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'file_extension_enum') THEN
          CREATE TYPE file_extension_enum AS ENUM ('html', 'json', 'js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'pdf', 'docx', 'ppt', 'pptx', 'xlsx', 'txt', 'zip', 'rar', 'ts', 'mp3', 'mp4', 'wav', 'avi');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "lesson-content-files" 
      ADD COLUMN "extension_enum" file_extension_enum
    `);

    await queryRunner.query(`
      UPDATE "lesson-content-files"
      SET "extension_enum" = "extension"::file_extension_enum
      WHERE "extension" IN ('html', 'json', 'js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'pdf', 'docx', 'ppt', 'pptx', 'xlsx', 'txt', 'zip', 'rar', 'ts', 'mp3', 'mp4', 'wav', 'avi')
    `);

    await queryRunner.query(`
      ALTER TABLE "lesson-content-files" 
      DROP COLUMN "extension"
    `);

    await queryRunner.query(`
      ALTER TABLE "lesson-content-files" 
      RENAME COLUMN "extension_enum" TO "extension"
    `);

    // Revert changes in student-lesson-files table
    await queryRunner.query(`
      ALTER TABLE "student-lesson-files" 
      ADD COLUMN "extension_enum" file_extension_enum
    `);

    await queryRunner.query(`
      UPDATE "student-lesson-files"
      SET "extension_enum" = "extension"::file_extension_enum
      WHERE "extension" IN ('html', 'json', 'js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'pdf', 'docx', 'ppt', 'pptx', 'xlsx', 'txt', 'zip', 'rar', 'ts', 'mp3', 'mp4', 'wav', 'avi')
    `);

    await queryRunner.query(`
      ALTER TABLE "student-lesson-files" 
      DROP COLUMN "extension"
    `);

    await queryRunner.query(`
      ALTER TABLE "student-lesson-files" 
      RENAME COLUMN "extension_enum" TO "extension"
    `);
  }
}
