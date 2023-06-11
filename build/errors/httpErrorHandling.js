"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotFoundRequest = exports.handleForbiddenRequest = exports.handleBadRequest = exports.handleUnauthorizedRequest = void 0;
const http2_1 = require("http2");
function handleErrorRequest(res, code, title, reason) {
    res.status(code).json({
        title,
        message: reason,
    });
}
function handleUnauthorizedRequest(res, reason) {
    handleErrorRequest(res, http2_1.constants.HTTP_STATUS_UNAUTHORIZED, "Unauthorized request", reason);
}
exports.handleUnauthorizedRequest = handleUnauthorizedRequest;
function handleBadRequest(res, reason) {
    handleErrorRequest(res, http2_1.constants.HTTP_STATUS_BAD_REQUEST, "Bad request", reason);
}
exports.handleBadRequest = handleBadRequest;
function handleForbiddenRequest(res, reason) {
    handleErrorRequest(res, http2_1.constants.HTTP_STATUS_FORBIDDEN, "Forbidden request", reason);
}
exports.handleForbiddenRequest = handleForbiddenRequest;
function handleNotFoundRequest(res, reason) {
    handleErrorRequest(res, http2_1.constants.HTTP_STATUS_NOT_FOUND, "Not found", reason);
}
exports.handleNotFoundRequest = handleNotFoundRequest;
