import { MigrationInterface, QueryRunner } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export class UnitSchool1739889888876 implements MigrationInterface {
  name = 'UnitSchool1739889888876'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions

    await queryRunner.query(`ALTER TABLE "course_units" ADD "schoolId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "course_units" ADD CONSTRAINT "FK_33b70b242e7bff1944aac64686e" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions

    await queryRunner.query(
      `ALTER TABLE "course_units" DROP CONSTRAINT "FK_33b70b242e7bff1944aac64686e"`,
    )

    await queryRunner.query(`ALTER TABLE "course_units" DROP COLUMN "schoolId"`)
  }
}
