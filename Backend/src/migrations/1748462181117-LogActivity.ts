import { MigrationInterface, QueryRunner, Table, Index, TableIndex } from 'typeorm';

export class LogActivity1748462181117 implements MigrationInterface {
  name = 'CreateActivityLogTable1234567890123';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for category
    await queryRunner.query(`
      CREATE TYPE "activity_category_enum" AS ENUM('user', 'page', 'notif')
    `);

    // Create the log_activity table
    await queryRunner.createTable(
      new Table({
        name: 'log_activity',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'category',
            type: 'enum',
            enum: ['user', 'page', 'notif'],
            enumName: 'activity_category_enum',
            isNullable: false,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'user',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'latency',
            type: 'integer',
            isNullable: true,
            comment: 'Response time in milliseconds',
          },
          {
            name: 'dump',
            type: 'jsonb',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    
    await queryRunner.createIndex('log_activity', new TableIndex({
      name: 'IDX_log_activity_category',
      columnNames: ['category'],
    }));

    await queryRunner.createIndex('log_activity', new TableIndex({
      name: 'IDX_log_activity_created_at',
      columnNames: ['createdAt'],
    }));

    await queryRunner.createIndex('log_activity', new TableIndex({
      name: 'IDX_log_activity_action',
      columnNames: ['action'],
    }));

    await queryRunner.createIndex('log_activity', new TableIndex({
      name: 'IDX_log_activity_status',
      columnNames: ['status'],
    }));

    // Create GIN index for JSONB user field for efficient JSON queries
    await queryRunner.query(`
      CREATE INDEX "IDX_log_activity_user_gin" ON "log_activity" USING GIN ("user")
    `);

    // Create composite index for common query patterns
    await queryRunner.query(`
      CREATE INDEX "IDX_log_activity_category_created_at" ON "log_activity" ("category", "createdAt" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('log_activity', 'IDX_log_activity_category_created_at');
    await queryRunner.dropIndex('log_activity', 'IDX_log_activity_user_gin');
    await queryRunner.dropIndex('log_activity', 'IDX_log_activity_status');
    await queryRunner.dropIndex('log_activity', 'IDX_log_activity_action');
    await queryRunner.dropIndex('log_activity', 'IDX_log_activity_created_at');
    await queryRunner.dropIndex('log_activity', 'IDX_log_activity_category');

    // Drop table
    await queryRunner.dropTable('log_activity');

    // Drop enum type
    await queryRunner.query(`DROP TYPE "activity_category_enum"`);
  }
}