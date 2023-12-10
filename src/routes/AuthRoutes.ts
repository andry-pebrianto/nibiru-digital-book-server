import { Router } from "express";
import AuthControllers from "../controllers/AuthControllers";
import { jwtAuth } from "../middlewares/jwtAuth";

const AuthRoutes = Router();

// POST | /google auth
AuthRoutes.post("/google-auth", AuthControllers.googleAuth);
// GET | /check
AuthRoutes.get("/check", jwtAuth, AuthControllers.check);

export default AuthRoutes;
