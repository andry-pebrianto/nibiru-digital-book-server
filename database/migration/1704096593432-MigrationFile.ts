import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationFile1704096593432 implements MigrationInterface {
    name = 'MigrationFile1704096593432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL, "fullname" character varying(100) NOT NULL, "email" character varying(50) NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL, "status" character varying(20) NOT NULL, "total" integer NOT NULL, "snap_token" text NOT NULL, "snap_redirect_url" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customer_id" uuid, "book_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genres" ("id" uuid NOT NULL, "title" character varying(50) NOT NULL, "photo" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL, "title" character varying(100) NOT NULL, "author" character varying(100) NOT NULL, "photos" text array NOT NULL, "synopsis" text NOT NULL, "file_url" text NOT NULL, "price" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "admin_id" uuid, "genre_id" uuid, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL, "fullname" character varying(100) NOT NULL, "email" character varying(50) NOT NULL, "google_id" text, "profile_picture" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "authentications" ("id" uuid NOT NULL, "owner_id" uuid NOT NULL, "token" text NOT NULL, CONSTRAINT "PK_2505c0cb39a2248520f306c1447" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carts" ("book_id" uuid NOT NULL, "customer_id" uuid NOT NULL, CONSTRAINT "PK_515aa05f6870ec73bb28f440a07" PRIMARY KEY ("book_id", "customer_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91996ba196828a4294750e32f0" ON "carts" ("book_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a9dade7a4baafc128f8e0d804" ON "carts" ("customer_id") `);
        await queryRunner.query(`CREATE TABLE "collections" ("book_id" uuid NOT NULL, "customer_id" uuid NOT NULL, CONSTRAINT "PK_0c074ee5df1a42b3b0de42e7c0d" PRIMARY KEY ("book_id", "customer_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_595682a9ce52756f710c51423b" ON "collections" ("book_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0b27f21645c32288a819189a6a" ON "collections" ("customer_id") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6f09843c214f21a462b54b11e8d" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_74f5550d011d85784a22e4dbf1c" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "books" ADD CONSTRAINT "FK_3918f94d71dd24649f2669669e1" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "books" ADD CONSTRAINT "FK_3b94b035d80d7564abd012014c8" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_91996ba196828a4294750e32f06" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_5a9dade7a4baafc128f8e0d8041" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collections" ADD CONSTRAINT "FK_595682a9ce52756f710c51423ba" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "collections" ADD CONSTRAINT "FK_0b27f21645c32288a819189a6ac" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collections" DROP CONSTRAINT "FK_0b27f21645c32288a819189a6ac"`);
        await queryRunner.query(`ALTER TABLE "collections" DROP CONSTRAINT "FK_595682a9ce52756f710c51423ba"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_5a9dade7a4baafc128f8e0d8041"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_91996ba196828a4294750e32f06"`);
        await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_3b94b035d80d7564abd012014c8"`);
        await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_3918f94d71dd24649f2669669e1"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_74f5550d011d85784a22e4dbf1c"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6f09843c214f21a462b54b11e8d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0b27f21645c32288a819189a6a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_595682a9ce52756f710c51423b"`);
        await queryRunner.query(`DROP TABLE "collections"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a9dade7a4baafc128f8e0d804"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91996ba196828a4294750e32f0"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TABLE "authentications"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TABLE "genres"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "admins"`);
    }

}
