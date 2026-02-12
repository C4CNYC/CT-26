import { MigrationInterface, QueryRunner } from 'typeorm'

export class LessContTypeVarChar1758730688465 implements MigrationInterface {
    name = 'LessContTypeVarChar1758730688465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Change column type from enum to varchar while preserving existing values
        await queryRunner.query(`ALTER TABLE "lessons-contents" 
            ALTER COLUMN "type" TYPE varchar 
            USING type::varchar`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // If we need to roll back, we'll convert the varchar back to enum
        // First recreate the enum type if it doesn't exist
        await queryRunner.query(`DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lesson_content_type_enum') THEN
                    CREATE TYPE "lesson_content_type_enum" AS ENUM('editable', 'slides', 'code', 'tinymce');
                END IF;
            END
            $$;`);
        
        // Then convert the column back to the enum type
        await queryRunner.query(`ALTER TABLE "lessons-contents" 
            ALTER COLUMN "type" TYPE lesson_content_type_enum 
            USING type::text::lesson_content_type_enum`);
    }
}
