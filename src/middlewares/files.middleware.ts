import { NextFunction, Request, RequestHandler, Response } from "express";
import { MulterError } from "multer";
import { handleBadRequest } from "../errors/httpErrorHandling";
import { constants } from "http2";

export function multerFileChecker(upload: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err instanceof MulterError) {
        handleBadRequest(res, err.message);
      } else if (err) {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send(err + "Upload failed due to unknown error");
      } else {
        next();
      }
    });
  };
}