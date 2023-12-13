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
      const images: string[] = [];

      if ((req as any).files) {
        if ((req as any).files.image) {
          for (let i = 0; i < (req as any).files?.image.length; i++) {
            const res: UploadApiResponse | undefined = await uploadToCloudinary(
              (req as any).files.image[i]
            );

            if (res) {
              images.push(res?.secure_url);
            }
            deleteFile((req as any).files.image[i].path);
          }
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
          images,
        },
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
