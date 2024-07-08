import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersAndSessions1716883152746 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user"
      (
        "id" SERIAL,
        "createdAt" timestamp NOT NULL DEFAULT NOW(),
        "updatedAt" timestamp NOT NULL DEFAULT NOW()
      );`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "session"
      (
        "id" SERIAL,
        "token" varchar NOT NULL UNIQUE,
        "userId" integer NOT NULL,
        "validUntil" timestamp NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT NOW(),
        "updatedAt" timestamp NOT NULL DEFAULT NOW()
      );`,
      undefined
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "session"`, undefined);
    await queryRunner.query(`DROP TABLE "user"`, undefined);
  }
}
