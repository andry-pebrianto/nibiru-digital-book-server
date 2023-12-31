import { Request, Response } from "express";
import AuthServices from "../../services/admins/AuthServices";
import runValidation from "../../utils/validator/runValidation";
import { adminLoginSchema } from "../../utils/validator/schema/authSchema";

export default new (class AuthControllers {
  login(req: Request, res: Response) {
    if (runValidation(req, res, adminLoginSchema) === "VALID") {
      AuthServices.login(req, res);
    }
  }
})();
