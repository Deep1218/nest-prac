import { MigrationInterface, QueryRunner } from 'typeorm';

export class Table1734081515132 implements MigrationInterface {
  name = 'Table1734081515132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "userId" bigint NOT NULL, "token" character varying NOT NULL, "type" "public"."tokens_type_enum" NOT NULL DEFAULT 'auth', "expireAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "status" "public"."users_status_enum" NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "status" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
