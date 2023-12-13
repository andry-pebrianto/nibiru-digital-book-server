import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import handleError from "../utils/exception/handleError";
import NotFoundError from "../utils/exception/custom/NotFoundError";

import apiSpec from "../utils/swagger/apiSpec";
import CustomerAuthRoutes from "../routes/customers/AuthRoutes";
import CustomerProfileRoutes from "../routes/customers/ProfileRoutes";
import CustomerBookRoutes from "../routes/customers/BookRoutes";
import AdminAuthRoutes from "../routes/admins/AuthRoutes";
import AdminBookRoutes from "../routes/admins/BookRoutes";
import UploadRoutes from "../routes/uploads/UploadRoutes";

const createServer: Express = express();

createServer.use(express.json());
createServer.use(helmet());
createServer.use(cors());

createServer.get("/", (req: Request, res: Response): Response<string> => {
  return res.status(200).send("Server Online!");
});

createServer.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));
createServer.use("/api/v1/customer/auth", CustomerAuthRoutes);
createServer.use("/api/v1/customer/profile", CustomerProfileRoutes);
createServer.use("/api/v1/customer/book", CustomerBookRoutes);
createServer.use("/api/v1/admin/auth", AdminAuthRoutes);
createServer.use("/api/v1/admin/book", AdminBookRoutes);
createServer.use("/api/v1/upload", UploadRoutes);

createServer.use((req: Request, res: Response): Response<string> => {
  return handleError(
    res,
    new NotFoundError("Resource on that url doesn't exist", "Not Found")
  );
});

export default createServer;
