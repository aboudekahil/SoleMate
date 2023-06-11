"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerFileChecker = void 0;
const multer_1 = require("multer");
const httpErrorHandling_1 = require("../errors/httpErrorHandling");
const http2_1 = require("http2");
function multerFileChecker(upload) {
    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer_1.MulterError) {
                (0, httpErrorHandling_1.handleBadRequest)(res, err.message);
            }
            else if (err) {
                res
                    .status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
                    .send(err + "Upload failed due to unknown error");
            }
            else {
                next();
            }
        });
    };
}
exports.multerFileChecker = multerFileChecker;
