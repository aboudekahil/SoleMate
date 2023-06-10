import { Request, Response } from "express";
import { constants } from "http2";
import { prisma } from "../config/prisma.config";
import { user_session_handler } from "../config/session.config";
import { users } from "@prisma/client";
import { handleUnauthorizedRequest } from "../errors/httpErrorHandling";

export async function sendReview(req: Request, res: Response) {
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
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Shoe not found",
    });
    return;
  }

  const shipment = await prisma.orders.findFirst({
    where: {
      user_id: user_session.user_id,
      shoe_id: shoe_id,
    },
  });

  if (!shipment) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Shoe not shipped",
    });
    return;
  }

  if (
    !Number.isInteger(customer_service_rating) ||
    !Number.isInteger(shipping_time_rating) ||
    !Number.isInteger(shipping_quality_rating) ||
    !Number.isInteger(website_performance_rating) ||
    !(0 <= customer_service_rating && customer_service_rating <= 5) ||
    !(0 <= shipping_time_rating && shipping_time_rating <= 5) ||
    !(0 <= shipping_quality_rating && shipping_quality_rating <= 5) ||
    !(0 <= website_performance_rating && website_performance_rating <= 5)
  ) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Rating must be an integer between 0 and 5",
    });
    return;
  }

  const review = await prisma.reviews.create({
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

  const user = (await prisma.users.findUnique({
    where: {
      user_id: user_session.user_id,
    },
  })) as users;

  if (!user.is_admin) {
    handleUnauthorizedRequest(res, ERROR_REASON.NOT_ADMIN);
    return;
  }

  if (!shoe_id) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Shoe id not provided",
    });
    return;
  }

  if (typeof shoe_id !== "string") {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Shoe id must be a string",
    });
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
