import { Request, Response } from "express";
import AuthServices from "../../services/customers/AuthServices";
import runValidation from "../../utils/validator/runValidation";
import { googleAuthSchema } from "../../utils/validator/schema/authSchema";

export default new (class AuthControllers {
  googleAuth(req: Request, res: Response) {
    if (runValidation(req, res, googleAuthSchema) === "VALID") {
      AuthServices.googleAuth(req, res);
    }
  }
  check(req: Request, res: Response) {
    AuthServices.check(req, res);
  }
  refreshAccessToken(req: Request, res: Response) {
    AuthServices.refreshAccessToken(req, res);
  }
  logout(req: Request, res: Response) {
    AuthServices.logout(req, res);
  }
})();
