import { Request, Response } from "express";
import { constants } from "http2";
import { prisma } from "../configs/prisma.config";
import { user_session_handler } from "../configs/session.config";
import {
  handleForbiddenRequest,
  handleUnauthorizedRequest,
} from "../errors/httpErrorHandling";
import { SendFeedBackBody } from "../schemas/feedback.schema";

export async function getFeedbacks(req: Request, res: Response) {
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

  const user = await prisma.users.findUnique({
    where: {
      user_id: user_session.user_id,
    },
  });

  if (!user?.is_admin) {
    handleForbiddenRequest(res, ERROR_REASON.NOT_ADMIN);
    return;
  }

  const feedbacks = await prisma.feedbacks.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      content: true,
      createdAt: true,
      users: {
        select: {
          name: true,
          family_name: true,
          email_address: true,
        },
      },
    },
  });

  res.status(constants.HTTP_STATUS_OK).json({
    title: "Feedbacks",
    message: "Feedbacks retrieved successfully",
    data: feedbacks,
  });
}

export async function sendFeedback(
  req: Request<any, any, SendFeedBackBody>,
  res: Response
) {
  const { content } = req.body;

  const { session_id }: cookies = req.cookies;

  const user = await user_session_handler.getSession(session_id);

  if (!user) {
    handleUnauthorizedRequest(res, ERROR_REASON.NOT_LOGGED_IN);
    return;
  }

  await prisma.feedbacks.create({
    data: {
      content,
      user_id: user.user_id,
    },
  });

  res.status(constants.HTTP_STATUS_CREATED).json({
    title: "Feedback sent",
    message: "Feedback sent successfully",
  });
}
