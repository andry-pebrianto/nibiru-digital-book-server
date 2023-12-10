import { createClient } from "redis";
import Env from "../utils/variables/Env";

const redisClient = createClient({
  password: Env.REDIS_PASSWORD,
  socket: {
    host: Env.REDIS_HOST,
    port: Env.REDIS_PORT,
  },
});

redisClient.on("error", (error) => {
  console.log("Redis Client", error);
  process.exit(1);
});

export default redisClient;

export async function redisConnect() {
  try {
    await redisClient.connect();
    console.log("Connected To Redis, Ready To Caching All Your Sin");
  } catch (error) {
    console.log("Redis Client", error);
    process.exit(1);
  }
}

export const DEFAULT_EXPIRATION = 3600;
