/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";

import { deleteFile } from "../../utils/file/fileHelper";
import handleError from "../../utils/exception/handleError";
import { uploadToCloudinary } from "../../utils/cloudinary/upload";
import BadRequestError from "../../utils/exception/custom/BadRequestError";

export default new (class UploadServices {
  async uploadToCloudinary(req: Request, res: Response): Promise<Response> {
    try {
      let image: UploadApiResponse | undefined = undefined;

      if ((req as any).files) {
        if ((req as any).files.image) {
          image = await uploadToCloudinary((req as any).files.image[0]);
          deleteFile((req as any).files.image[0].path);
        } else {
          throw new BadRequestError(
            `The fieldname "image" does not have a file object.`,
            "Upload Image Failed"
          );
        }
      } else {
        throw new BadRequestError(
          `The fieldname "image" not found.`,
          "Upload Image Failed"
        );
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Upload Image Success",
        data: {
          url: image?.secure_url,
        },
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
