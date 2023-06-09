import { Request, Response } from "express";
import { constants } from "http2";
import { prisma } from "../configs/prisma.config";
import { user_session_handler } from "../configs/session.config";
import { users } from "@prisma/client";
import {
  handleBadRequest,
  handleForbiddenRequest,
  handleUnauthorizedRequest,
} from "../errors/httpErrorHandling";
import { CreateReviewBody } from "../schemas/review.schema";

export async function sendReview(
  req: Request<any, any, CreateReviewBody>,
  res: Response
) {
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

  const user = (await prisma.users.findUnique({
    where: {
      user_id: user_session.user_id,
    },
  })) as users;

  if (!user.is_verified) {
    handleUnauthorizedRequest(res, ERROR_REASON.UNVERIFIED_ACCOUNT);
    return;
  }

  const {
    customer_service_rating,
    shipping_time_rating,
    shipping_quality_rating,
    website_performance_rating,
    shoe_id,
  } = req.body;

  const shoe = await prisma.shoes.findUnique({
    where: {
      shoe_id: shoe_id,
    },
  });

  if (!shoe) {
    handleBadRequest(res, "Shoe provided is not valid");
    return;
  }

  const shipment = await prisma.orders.findFirst({
    where: {
      user_id: user_session.user_id,
      shoe_id: shoe_id,
    },
  });

  if (!shipment) {
    handleBadRequest(res, "Shoe not shipped yet");
    return;
  }

  await prisma.reviews.create({
    data: {
      customer_service_rating: customer_service_rating,
      shipping_time_rating: shipping_time_rating,
      shipping_quality_rating: shipping_quality_rating,
      website_performance_rating: website_performance_rating,
      shoe_id: shoe_id,
      user_id: user_session.user_id,
    },
  });

  res.status(constants.HTTP_STATUS_CREATED).json({
    title: "Review sent",
    message: "Review sent successfully",
  });
}

export async function getReviews(req: Request, res: Response) {
  const shoe_id = req.query.shoe_id;

  const session_id = req.cookies.session_id;

  if (!session_id) {
    handleUnauthorizedRequest(res, ERROR_REASON.NOT_LOGGED_IN);
    return;
  }

  const user_session = await user_session_handler.getSession(session_id);

  if (!user_session) {
    handleUnauthorizedRequest(res, ERROR_REASON.NOT_LOGGED_IN);
    return;
  }

  const user = await prisma.users.findUnique({
    where: {
      user_id: user_session.user_id,
    },
  });

  if (!user?.is_admin) {
    handleForbiddenRequest(res, ERROR_REASON.NOT_ADMIN);
    return;
  }

  if (!shoe_id) {
    handleBadRequest(res, "Shoe id not provided");
    return;
  }

  if (typeof shoe_id !== "string") {
    handleBadRequest(res, "Shoe id must be a string");
    return;
  }

  const reviews = await prisma.reviews.findMany({
    where: {
      shoe_id: shoe_id,
    },
    include: {
      user: {
        select: {
          name: true,
          family_name: true,
          email_address: true,
          user_id: true,
        },
      },
      shoe: {
        select: {
          name: true,
          shoe_id: true,
        },
      },
    },
  });

  res.status(constants.HTTP_STATUS_OK).json({
    title: "Reviews",
    message: "Reviews retrieved successfully",
    data: reviews,
  });
}
