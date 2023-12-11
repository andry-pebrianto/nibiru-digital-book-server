import { Router } from "express";
import { jwtAuth } from "../../middlewares/jwtAuth";
import AuthServices from "../../services/customers/AuthServices";

const authServices = new AuthServices();

const AuthRoutes = Router();
AuthRoutes.post("/google-auth", authServices.googleAuth);
AuthRoutes.get("/check", jwtAuth, authServices.check);

export default AuthRoutes;
