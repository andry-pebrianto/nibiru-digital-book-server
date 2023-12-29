import { Router } from "express";
import { jwtAuth } from "../../middlewares/jwtAuth";
import ProfileControllers from "../../controllers/customers/ProfileControllers";
import { onlyCustomer } from "../../middlewares/authorization";

const ProfileRoutes = Router();
ProfileRoutes.get("/detail", jwtAuth, onlyCustomer, ProfileControllers.findOneByJwt);
ProfileRoutes.get("/cart", jwtAuth, onlyCustomer, ProfileControllers.myCart);

export default ProfileRoutes;
