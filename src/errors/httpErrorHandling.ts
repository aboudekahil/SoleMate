import { constants } from "http2";
import { Response } from "express";

function handleErrorRequest(
  res: Response,
  code: number,
  title: string,
  reason: ERROR_REASON | string
) {
  res.status(code).json({
    title,
    message: reason,
  });
}

export function handleUnauthorizedRequest(
  res: Response,
  reason: string | ERROR_REASON
) {
  handleErrorRequest(
    res,
    constants.HTTP_STATUS_UNAUTHORIZED,
    "Unauthorized request",
    reason
  );
}

export function handleBadRequest(res: Response, reason: string | ERROR_REASON) {
  handleErrorRequest(
    res,
    constants.HTTP_STATUS_BAD_REQUEST,
    "Bad request",
    reason
  );
}

export function handleForbiddenRequest(
  res: Response,
  reason: string | ERROR_REASON
) {
  handleErrorRequest(
    res,
    constants.HTTP_STATUS_FORBIDDEN,
    "Forbidden request",
    reason
  );
}

export function handleNotFoundRequest(
  res: Response,
  reason: string | ERROR_REASON
) {
  handleErrorRequest(res, constants.HTTP_STATUS_NOT_FOUND, "Not found", reason);
}
