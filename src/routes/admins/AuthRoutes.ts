import { Router } from "express";
import AuthControllers from "../../controllers/admins/AuthControllers";

const AuthRoutes = Router();
AuthRoutes.post("/login", AuthControllers.login);

export default AuthRoutes;
