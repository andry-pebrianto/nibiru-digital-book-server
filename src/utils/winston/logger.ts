import winston from "winston";

const logger = winston.createLogger({
  level: "error", // Atur level log ke tingkat kesalahan
  format: winston.format.json(), // Format log dalam bentuk JSON
  transports: [
    new winston.transports.File({
      filename: `logs/errors.log`,
      level: "error",
    }),
    new winston.transports.Console(), // Output log ke konsol juga
  ],
});

export function handleLog(error: string, user: string): void {
  logger.error({ error, date: new Date().getTime(), user });
}

export default logger;
