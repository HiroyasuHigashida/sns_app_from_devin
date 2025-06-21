import { MigrationInterface, QueryRunner } from "typeorm";

export class All1713791901742 implements MigrationInterface {
    name = 'All1713791901742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`profile\` varchar(1024) NULL COMMENT 'プロフィール', \`registerd_at\` datetime(6) NOT NULL COMMENT 'ユーザ登録日時' DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL COMMENT '投稿内容', \`type\` enum ('post') NOT NULL COMMENT '投稿タイプ' DEFAULT 'post', \`posted_at\` datetime(6) NOT NULL COMMENT '投稿日時' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
