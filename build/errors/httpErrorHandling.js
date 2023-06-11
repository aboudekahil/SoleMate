"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotFoundRequest = exports.handleForbiddenRequest = exports.handleBadRequest = exports.handleUnauthorizedRequest = void 0;
const http2_1 = require("http2");
const zod_1 = require("zod");
const ErrorSchema = zod_1.z
    .array(zod_1.z.object({ field: zod_1.z.string(), message: zod_1.z.string() }))
    .nonempty();
function handleErrorRequest(res, code, title, reason) {
    if (typeof reason === "string") {
        return res.status(code).json({
            title,
            error: reason,
        });
    }
    return res.status(code).json({
        title,
        error: ErrorSchema.parse(reason),
    });
}
function handleUnauthorizedRequest(res, reason) {
    return handleErrorRequest(res, http2_1.constants.HTTP_STATUS_UNAUTHORIZED, "Unauthorized request", reason);
}
exports.handleUnauthorizedRequest = handleUnauthorizedRequest;
function handleBadRequest(res, reason) {
    return handleErrorRequest(res, http2_1.constants.HTTP_STATUS_BAD_REQUEST, "Bad request", reason);
}
exports.handleBadRequest = handleBadRequest;
function handleForbiddenRequest(res, reason) {
    return handleErrorRequest(res, http2_1.constants.HTTP_STATUS_FORBIDDEN, "Forbidden request", reason);
}
exports.handleForbiddenRequest = handleForbiddenRequest;
function handleNotFoundRequest(res, reason) {
    return handleErrorRequest(res, http2_1.constants.HTTP_STATUS_NOT_FOUND, "Not found", reason);
}
exports.handleNotFoundRequest = handleNotFoundRequest;
