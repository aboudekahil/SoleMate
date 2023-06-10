import {Request, Response} from "express";
import UserService from "../services/userService";
import {InvalidError} from "../errors/InvalidError";
import {user_session_handler} from "../config/session.config";
import {constants} from "http2";
import {isEmail, isEnum, isPhoneNumber} from "class-validator";
import {users_payment_option} from "@prisma/client";
import {handleUnauthorizedRequest} from "../errors/httpErrorHandling";

// {
//   "apartment": "123",
//     "building": "456",
//     "city": "Tyr",
//     "email_address": "aboudehkahil@gmail.com",
//     "family_name": "kahil",
//     "name": "abd el kader kahil",
//     "password": "aboudeh2004",
//     "payment_option": "Whish",
//     "payment_values": {
//   "OMT": null,
//       "Whish": "123456789"
// },
//   "phone_number": "71493037",
//     "street": "Bayak"
// }

export async function signup(req: Request, res: Response) {
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
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        title: "Bad Request",
        message: "Payment option is not valid",
      });
      return;
    }

    if (!isEmail(email_address)) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        title: "Bad Request",
        message: "Email is not valid",
      });
      return;
    }

    if (!isPhoneNumber(phone_number, "LB")) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        title: "Bad Request",
        message: "Phone number is not valid",
      });
      return;
    }

    if (
      (payment_option === "Whish" && !Whish) ||
      (payment_option === "OMT" && !OMT)
    ) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        title: "Bad Request",
        message: "Payment values do not match payment option",
      });

      return;
    }

    if (!((Whish && Whish.length >= 3) || (OMT && OMT.length >= 3))) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        title: "Bad Request",
        message: "Payment values must be at least 3 characters long",
      });

      return;
    }

    const user_service = new UserService();

    req.body.password = await user_service.hashPassword(req.body.password);

    const created_user = await user_service.signUserUp(req.body);

    const session = await user_session_handler.createSession(
      created_user.user_id
    );

    res.cookie("session_id", session.session_id, {
      httpOnly: true,
      expires: session.timeout_date,
      // secure: true,
    });

    res
      .status(constants.HTTP_STATUS_CREATED)
      .json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof InvalidError)
      res
        .status(constants.HTTP_STATUS_FORBIDDEN)
        .json(JSON.parse(error.toString()));
    else if (error instanceof TypeError)
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        title: "Bad Request",
        message: "Request body is empty",
      });
    else
      res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  const user_service = new UserService();
  const found_user = await user_service.findUserByEmailAndPassword(
    req.body.email_address,
    req.body.password
  );

  if (!found_user) {
    handleUnauthorizedRequest(res, "Email or password is incorrect");
    return;
  }

  const session = await user_session_handler.createSession(found_user.user_id);

  res.cookie("session_id", session.session_id, {
    httpOnly: true,
    expires: session.timeout_date,
    // secure: true,
  });

  res
    .status(constants.HTTP_STATUS_OK)
    .json({ message: "User logged in successfully" });
}

export async function logout(req: Request, res: Response) {
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
