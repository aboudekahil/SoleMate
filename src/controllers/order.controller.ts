import { Request, Response } from "express";
import { constants } from "http2";
import { user_session_handler } from "../config/session.config";
import { prisma } from "../config/prisma.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { orders } from "@prisma/client";
import {
  handleBadRequest,
  handleUnauthorizedRequest,
} from "../errors/httpErrorHandling";

export async function placeOrder(req: Request, res: Response) {
  const { shoe_id } = req.body;
  const session_id: string | undefined = req.cookies.session_id;

  if (!session_id) {
    handleUnauthorizedRequest(res, ERROR_REASON.NOT_LOGGED_IN);
    return;
  }

  const user_session = await user_session_handler.getSession(session_id);

  if (!user_session) {
    handleUnauthorizedRequest(res, ERROR_REASON.NOT_LOGGED_IN);
    return;
  }
  let order: orders;
  try {
    order = await prisma.orders.create({
      data: {
        user: {
          connect: {
            user_id: user_session.user_id,
          },
        },
        shoe: {
          connect: {
            shoe_id,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        handleBadRequest(res, "Shoe provided is not valid");
      }
    } else {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        title: "Internal server error",
        message: "Failed to place order",
      });
    }
    return;
  }

  res.status(constants.HTTP_STATUS_CREATED).json({
    title: "Order placed",
    message: "Order placed successfully",
    order: order,
  });
}
