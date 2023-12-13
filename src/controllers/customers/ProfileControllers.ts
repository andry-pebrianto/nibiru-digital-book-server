import { Request, Response } from "express";
import ProfileServices from "../../services/customers/ProfileServices";

export default new (class ProfileControllers {
  findOneByJwt(req: Request, res: Response) {
    ProfileServices.findOneByJwt(req, res);
  }
})();
