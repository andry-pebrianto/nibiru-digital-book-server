import { Router } from "express";
import { jwtAuth } from "../../middlewares/jwtAuth";
import ProfileControllers from "../../controllers/customers/ProfileControllers";

const ProfileRoutes = Router();
ProfileRoutes.get("/detail", jwtAuth, ProfileControllers.findOneByJwt);

export default ProfileRoutes;
