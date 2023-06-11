import { constants } from "http2";
import { Response } from "express";
import { z } from "zod";

const ErrorSchema = z
  .array(z.object({ field: z.string(), message: z.string() }))
  .nonempty();

export type ErrorType = z.infer<typeof ErrorSchema>;

type ErrorReason = string | ERROR_REASON | ErrorType;

function handleErrorRequest(
  res: Response,
  code: number,
  title: string,
  reason: ErrorReason
) {
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

export function handleUnauthorizedRequest(res: Response, reason: ErrorReason) {
  return handleErrorRequest(
    res,
    constants.HTTP_STATUS_UNAUTHORIZED,
    "Unauthorized request",
    reason
  );
}

export function handleBadRequest(res: Response, reason: ErrorReason) {
  return handleErrorRequest(
    res,
    constants.HTTP_STATUS_BAD_REQUEST,
    "Bad request",
    reason
  );
}

export function handleForbiddenRequest(res: Response, reason: ErrorReason) {
  return handleErrorRequest(
    res,
    constants.HTTP_STATUS_FORBIDDEN,
    "Forbidden request",
    reason
  );
}

export function handleNotFoundRequest(res: Response, reason: ErrorReason) {
  return handleErrorRequest(
    res,
    constants.HTTP_STATUS_NOT_FOUND,
    "Not found",
    reason
  );
}
