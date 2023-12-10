import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import handleError from "../utils/exception/handleError";
import NotFoundError from "../utils/exception/custom/NotFoundError";

import AuthRoutes from "../routes/AuthRoutes";
import apiSpec from "../utils/swagger/apiSpec";

const createServer: Express = express();

createServer.use(express.json());
createServer.use(helmet());
createServer.use(cors());

createServer.get("/", (req: Request, res: Response): Response<string> => {
  return res.status(200).send("Server Online!");
});

createServer.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));
createServer.use("/api/v1", AuthRoutes);

createServer.use((req: Request, res: Response): Response<string> => {
  return handleError(
    res,
    new NotFoundError("Resource on that url doesn't exist", "Not Found")
  );
});

export default createServer;
