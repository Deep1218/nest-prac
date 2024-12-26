import { MigrationInterface, QueryRunner } from "typeorm";

export class Table1735221372123 implements MigrationInterface {
    name = 'Table1735221372123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."activities_type_enum" AS ENUM('new memeber add', 'memeber loged in', 'memeber created a new post')`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" SERIAL NOT NULL, "description" text, "type" "public"."activities_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP TYPE "public"."activities_type_enum"`);
    }

}
