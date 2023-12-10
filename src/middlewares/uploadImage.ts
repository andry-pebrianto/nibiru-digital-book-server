import { NextFunction, Request, Response } from "express";
import multer from "multer";
import handleError from "../utils/exception/handleError";
import BadRequestError from "../utils/exception/custom/BadRequestError";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image"); // menyimpan file di direktori './public/image'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // menetapkan nama file
  },
});

const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
  storage: storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError(
          "The accepted image extensions are only .jpg, .png, .webp, and .gif.",
          "FILE EXTENSION NOT ALLOWED"
        )
      );
    }
  },
});

export function uploadImage(req: Request, res: Response, next: NextFunction) {
  const multerFields = multerUpload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]);

  multerFields(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return handleError(
          res,
          new BadRequestError(
            `The uploaded file (${err.field}) is too large, exceeding the maximum limit of 2MB.`,
            "LIMIT FILE SIZE"
          )
        );
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return handleError(
          res,
          new BadRequestError(
            `Unexpected field (${err.field}).`,
            "LIMIT UNEXPECTED FILE"
          )
        );
      }

      return handleError(res, err);
    } else {
      next();
    }
  });
}
