import { z } from "zod";
import { Request, Response } from "express";
import { handleBadRequest } from "../errors/httpErrorHandling";
import { parseErrorMessages } from "../errors/validationErrorHandling";

export function makePostEndpoint<TBody>(
  schema: z.Schema<TBody>,
  callback: (req: Request<any, any, TBody>, res: Response) => Promise<void>
) {
  return async (req: Request, res: Response) => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      return handleBadRequest(res, parseErrorMessages(result.error));
    }

    return callback(req as any, res);
  };
}
