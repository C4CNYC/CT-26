import { MigrationInterface, QueryRunner } from 'typeorm'

export class OrganizationAdmin1736985560249 implements MigrationInterface {
  name = 'OrganizationAdmin1736985560249'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_7857f65e94524a542ecb7de8f89"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_073c98f1567647b4dcec431d147"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users_schools" DROP CONSTRAINT "FK_7ea92212ec5ba33043f0ecd3222"`,
    )
    await queryRunner.query(
      `ALTER TABLE "students_pined_assignment_assigments" DROP CONSTRAINT "FK_a7abfd65256f802ddb72a017f1a"`,
    )
    await queryRunner.query(`ALTER TABLE "organization" ADD "ownerId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "UQ_67c515257c7a4bc221bb1857a39" UNIQUE ("ownerId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_67c515257c7a4bc221bb1857a39" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_7857f65e94524a542ecb7de8f89" FOREIGN KEY ("studentProfileId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_073c98f1567647b4dcec431d147" FOREIGN KEY ("activityId") REFERENCES "user-activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "users_schools" ADD CONSTRAINT "FK_7ea92212ec5ba33043f0ecd3222" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "students_pined_assignment_assigments" ADD CONSTRAINT "FK_a7abfd65256f802ddb72a017f1a" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students_pined_assignment_assigments" DROP CONSTRAINT "FK_a7abfd65256f802ddb72a017f1a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users_schools" DROP CONSTRAINT "FK_7ea92212ec5ba33043f0ecd3222"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_073c98f1567647b4dcec431d147"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_7857f65e94524a542ecb7de8f89"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_67c515257c7a4bc221bb1857a39"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "UQ_67c515257c7a4bc221bb1857a39"`,
    )
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "ownerId"`)
    await queryRunner.query(
      `ALTER TABLE "students_pined_assignment_assigments" ADD CONSTRAINT "FK_a7abfd65256f802ddb72a017f1a" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "users_schools" ADD CONSTRAINT "FK_7ea92212ec5ba33043f0ecd3222" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_073c98f1567647b4dcec431d147" FOREIGN KEY ("activityId") REFERENCES "user-activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_7857f65e94524a542ecb7de8f89" FOREIGN KEY ("studentProfileId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }
}
