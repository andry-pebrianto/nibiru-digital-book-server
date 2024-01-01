import "reflect-metadata";
import { DataSource } from "typeorm";
import Env from "../src/utils/variables/Env";
import { Customer } from "./entities/Customer";
import { Admin } from "./entities/Admin";
import { Book } from "./entities/Book";
import { Transaction } from "./entities/Transaction";
import { Authentication } from "./entities/Autentication";
import { Genre } from "./entities/Genre";
import { MigrationFile1704096593432 } from "./migration/1704096593432-MigrationFile";

export const PostgreDataSource = new DataSource({
  type: "postgres",
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  username: Env.DB_USERNAME,
  password: Env.DB_PASSWORD,
  database: Env.DB_NAME,
  synchronize: Env.NODE_ENV === "prod" ? false : true,
  logging: Env.NODE_ENV === "prod" ? false : true,
  entities: [Customer, Admin, Book, Transaction, Authentication, Genre],
  migrations: [MigrationFile1704096593432],
  subscribers: [],
  ssl: Env.NODE_ENV === "prod" ? true : false,
});
