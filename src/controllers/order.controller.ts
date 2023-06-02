import { Request, Response } from "express";
import { constants } from "http2";
import { user_session_handler } from "../config/session.config";
import { prisma } from "../config/prisma.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { orders } from "@prisma/client";

export async function placeOrder(req: Request, res: Response) {
  const { shoe_id } = req.body;
  debugger;
  if (!req.cookies.session_id) {
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      title: "Unauthorized request",
      message: "User not logged in",
    });
  }
  const { session_id }: cookies = req.cookies;

  const user = await user_session_handler.getSession(session_id);

  if (!user) {
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      title: "Unauthorized request",
      message: "Invalid session_id cookie",
    });
    return;
  }
  let order: orders;
  try {
    order = await prisma.orders.create({
      data: {
        user: {
          connect: {
            user_id: user.user_id,
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
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
          title: "Bad request",
          message: "Invalid shoe_id",
        });
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
