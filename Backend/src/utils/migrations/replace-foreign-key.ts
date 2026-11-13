import { QueryRunner } from 'typeorm'

export type ForeignKeyDeleteRule = {
  table: string
  constraint: string
  column: string
  references: string
  onDelete: 'CASCADE' | 'SET NULL'
}

// Postgres can't change a foreign key's ON DELETE in place, so drop it and add it again
export async function replaceForeignKey(
  queryRunner: QueryRunner,
  rule: ForeignKeyDeleteRule,
  onDelete: ForeignKeyDeleteRule['onDelete'] | 'NO ACTION',
): Promise<void> {
  await queryRunner.query(
    `ALTER TABLE "${rule.table}" DROP CONSTRAINT IF EXISTS "${rule.constraint}"`,
  )
  await queryRunner.query(
    `ALTER TABLE "${rule.table}" ADD CONSTRAINT "${rule.constraint}" FOREIGN KEY ("${rule.column}") REFERENCES "${rule.references}"("id") ON DELETE ${onDelete} ON UPDATE NO ACTION`,
  )
}
