import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import handleError from "../utils/exception/handleError";
import NotFoundError from "../utils/exception/custom/NotFoundError";

import apiSpec from "../utils/swagger/apiSpec";
import AuthCustomerRoutes from "../routes/customers/AuthRoutes";
import CustomerRoutes from "../routes/customers/CustomerRoutes";
import AuthAdminRoutes from "../routes/customers/AuthRoutes";
import UploadRoutes from "../routes/uploads/UploadRoutes";

const createServer: Express = express();

createServer.use(express.json());
createServer.use(helmet());
createServer.use(cors());

createServer.get("/", (req: Request, res: Response): Response<string> => {
  return res.status(200).send("Server Online!");
});

createServer.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));
createServer.use("/api/v1/customer", AuthCustomerRoutes);
createServer.use("/api/v1/customer", CustomerRoutes);
createServer.use("/api/v1/admin", AuthAdminRoutes);
createServer.use("/api/v1/upload", UploadRoutes);

createServer.use((req: Request, res: Response): Response<string> => {
  return handleError(
    res,
    new NotFoundError("Resource on that url doesn't exist", "Not Found")
  );
});

export default createServer;
