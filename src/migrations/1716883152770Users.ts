import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1716883152770 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" varchar NOT NULL;
      ALTER TABLE "user" ADD "password" varchar NOT NULL;
      ALTER TABLE "user" ADD "verifiedAt" timestamp;`,
      undefined
    );
  }

  async down(): Promise<void> {}
}
