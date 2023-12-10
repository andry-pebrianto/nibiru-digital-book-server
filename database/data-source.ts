import "reflect-metadata";
import { DataSource } from "typeorm";
import Env from "../src/utils/variables/Env";
import { User } from "./entities/User";

export const PostgreDataSource = new DataSource({
  type: "postgres",
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  username: Env.DB_USERNAME,
  password: Env.DB_PASSWORD,
  database: Env.DB_NAME,
  synchronize: Env.NODE_ENV === "prod" ? false : true,
  logging: Env.NODE_ENV === "prod" ? false : true,
  entities: [User],
  migrations: [],
  subscribers: [],
  ssl: Env.NODE_ENV === "prod" ? false : true,
});
