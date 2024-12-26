import { MigrationInterface, QueryRunner } from 'typeorm';

export class Table1735215713157 implements MigrationInterface {
  name = 'Table1735215713157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "companyId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_f6deb4e21ba78416f476cd661e1" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_f6deb4e21ba78416f476cd661e1"`,
    );
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "companyId"`);
  }
}
