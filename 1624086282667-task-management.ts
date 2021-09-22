import { MigrationInterface, QueryRunner } from "typeorm";

export class taskManagement1624086282667 implements MigrationInterface {
    // todo: User
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE IF NOT EXISTS task-management'
            + 'id UUID DEFAULT uuid_generate_v4()'
            + 'title VARCHAR NOT NULL'
            + 'description VARCHAR NOT NULL'
            + 'status title VARCHAR NOT NULL'
            + 'PRIMARY KEY (id)');
    }

    // todo: User
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS task-management");
    }
}
