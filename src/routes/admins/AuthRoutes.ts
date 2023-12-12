import { Router } from "express";
import { jwtAuth } from "../../middlewares/jwtAuth";
import AuthControllers from "../../controllers/admins/AuthControllers";

const AuthRoutes = Router();
AuthRoutes.post("/login", AuthControllers.googleAuth);
AuthRoutes.get("/check", jwtAuth, AuthControllers.check);

export default AuthRoutes;
