import { Router } from "express";
import UploadControllers from "../../controllers/uploads/UploadControllers";
import { uploadImage } from "../../middlewares/uploadImage";
import { jwtAuth } from "../../middlewares/jwtAuth";

const UploadRoutes = Router();
UploadRoutes.post("/", jwtAuth, uploadImage, UploadControllers.uploadToCloudinary);

export default UploadRoutes;
