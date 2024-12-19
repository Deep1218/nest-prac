import { MigrationInterface, QueryRunner } from "typeorm";

export class Table1734084103050 implements MigrationInterface {
    name = 'Table1734084103050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."companies_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "status" "public"."companies_status_enum" NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."companies_status_enum"`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "status" boolean NOT NULL DEFAULT true`);
    }

}
