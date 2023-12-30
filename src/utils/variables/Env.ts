import dotenv from "dotenv";

dotenv.config();

class Env {
  static NODE_ENV: string = process.env.NODE_ENV || "prod";
  static PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  static DB_HOST: string = process.env.DB_HOST || "localhost";
  static DB_PORT: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
  static DB_USERNAME: string = process.env.DB_USERNAME || "postgres";
  static DB_PASSWORD: string = process.env.DB_PASSWORD || "secret";
  static DB_NAME: string = process.env.DB_NAME || "typeorm-db";
  static REFRESH_TOKEN_KEY: string = process.env.REFRESH_TOKEN_KEY || "refresh_token";
  static ACCESS_TOKEN_KEY: string = process.env.ACCESS_TOKEN_KEY || "access_token";
  static EMAIL_FROM: string = process.env.EMAIL_FROM || "myemail@mail.com";
  static EMAIL_USER: string = process.env.EMAIL_USER || "myemail@mail.com";
  static GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "test";
  static GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || "test";
  static REDIRECT_URI: string = process.env.REDIRECT_URI || "test";
  static GMAIL_REFRESH_TOKEN: string = process.env.GMAIL_REFRESH_TOKEN || "test";
  static CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "cludinary_cloud_name";
  static CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "cludinary_api_key";
  static CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "cludinary_api_secret";
  static REDIS_PORT: number = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
  static REDIS_HOST: string = process.env.REDIS_HOST || "redis.com";
  static REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || "secretredispw";
  static MIDTRANS_APP_URL: string = process.env.MIDTRANS_APP_URL || "midtrans_app_url";
  static MIDTRANS_SERVER_KEY: string = process.env.MIDTRANS_SERVER_KEY || "midtrans_server_key";
}

export default Env;
