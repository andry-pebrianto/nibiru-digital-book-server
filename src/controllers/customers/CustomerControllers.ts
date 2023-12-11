import { Request, Response } from "express";
import CustomerServices from "../../services/customers/CustomerServices";

export default new (class CustomerControllers {
  findOneByJwt(req: Request, res: Response) {
    CustomerServices.findOneByJwt(req, res);
  }
})();
