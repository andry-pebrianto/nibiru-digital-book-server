import { Router } from "express";
import { jwtAuth } from "../../middlewares/jwtAuth";
import AuthControllers from "../../controllers/customers/AuthControllers";

const AuthRoutes = Router();
AuthRoutes.post("/google-auth", AuthControllers.googleAuth);
AuthRoutes.get("/check", jwtAuth, AuthControllers.check);
AuthRoutes.get("/refresh/:token", AuthControllers.refreshAccessToken);
AuthRoutes.delete("/logout/:token", AuthControllers.logout);

export default AuthRoutes;
