import { Request, Response } from "express";
import UploadServices from "../../services/uploads/UploadServices";

export default new (class AuthControllers {
  uploadToCloudinary(req: Request, res: Response) {
    UploadServices.uploadToCloudinary(req, res);
  }
})();
