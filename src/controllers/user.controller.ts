import { Request, Response } from "express";
import { user_session_handler } from "../configs/session.config";
import { constants } from "http2";
import { isEmail, isEnum, isPhoneNumber } from "class-validator";
import { users_payment_option } from "@prisma/client";
import {
  handleBadRequest,
  handleUnauthorizedRequest,
} from "../errors/httpErrorHandling";
import { prisma } from "../configs/prisma.config";
import bcrypt from "bcrypt";

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const {
      apartment,
      building,
      city,
      email_address,
      family_name,
      name,
      password,
      payment_option,
      payment_values: { OMT, Whish },
      phone_number,
      street,
    }: UserCreateBody = req.body;

    if (!isEnum(payment_option, users_payment_option)) {
      handleBadRequest(res, "Payment option is not valid");
      return;
    }

    if (!isEmail(email_address)) {
      handleBadRequest(res, "Email is not valid");
      return;
    }

    if (!isPhoneNumber(phone_number, "LB")) {
      handleBadRequest(res, "Phone number is not valid");
      return;
    }

    if (
      (payment_option === "Whish" && !Whish) ||
      (payment_option === "OMT" && !OMT)
    ) {
      handleBadRequest(res, "Payment values do not match payment option");
      return;
    }

    if (!((Whish && Whish.length >= 3) || (OMT && OMT.length >= 3))) {
      handleBadRequest(
        res,
        "Payment values must be at least 3 characters long"
      );
      return;
    }

    req.body.password = await bcrypt.hash(password, 15);
    const found_city = await prisma.cities.findUnique({
      where: {
        name: city,
      },
    });

    if (!found_city) {
      //   ^?
      handleBadRequest(res, "City is not valid");
      return;
    }

    const created_user = await prisma.users.create({
      data: {
        name,
        family_name,
        password,
        email_address,
        phone_number,
        street,
        apartment,
        building,
        payment_option,
        city_id: found_city.city_id,
        whish_payment: Whish
          ? {
              create: {
                value: Whish,
              },
            }
          : undefined,
        omt_payment: OMT
          ? {
              create: {
                value: OMT,
              },
            }
          : undefined,
      },
    });

    const session = await user_session_handler.createSession(
      created_user.user_id
    );

    res.cookie("session_id", session.session_id, {
      httpOnly: true,
      expires: session.timeout_date,
      secure: process.env.IS_PROD === "TRUE",
    });

    res
      .status(constants.HTTP_STATUS_CREATED)
      .json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof TypeError)
      handleBadRequest(res, "Request body is not valid");
    else
      res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const found_user = await prisma.users.findUnique({
    where: {
      email_address: req.body.email_address,
    },
  });

  if (!found_user) {
    handleUnauthorizedRequest(res, "Email not found");
    return;
  }

  const is_password_valid = await bcrypt.compare(
    req.body.password,
    found_user.password
  );

  if (!is_password_valid) {
    handleUnauthorizedRequest(res, "Email or password is incorrect");
    return;
  }

  const session = await user_session_handler.createSession(found_user.user_id);

  res.cookie("session_id", session.session_id, {
    httpOnly: true,
    expires: session.timeout_date,
    secure: process.env.IS_PROD === "TRUE",
  });

  res
    .status(constants.HTTP_STATUS_OK)
    .json({ message: "User logged in successfully" });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const session_id = req.cookies.session_id;

  if (!session_id) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad Request",
      message: "Session id is not provided",
    });
    return;
  }

  await user_session_handler.deleteSession(session_id);

  res.clearCookie("session_id");

  res
    .status(constants.HTTP_STATUS_OK)
    .json({ message: "User logged out successfully" });
}
