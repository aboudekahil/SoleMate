import {Request, Response} from "express";
import UserService from "../services/userService";
import {InvalidError} from "../errors/InvalidError";
import {user_session_handler} from "../config/session.config";
import {constants} from "http2";

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
    const user_service = new UserService();

    req.body.password = await user_service.hashPassword(req.body.password);

    const created_user = await user_service.signUserUp(req.body);

    const session = await user_session_handler.createSession(
      created_user.user_id
    );

    res.cookie("session_id", session.session_id, {
      httpOnly: true,
      expires: session.timeout_date,
      secure: true,
    });

    res
      .status(constants.HTTP_STATUS_CREATED)
      .json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof InvalidError)
      res
        .status(constants.HTTP_STATUS_FORBIDDEN)
        .json(JSON.parse(error.toString()));
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
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      title: "Invalid credentials",
      message: "Email or password is incorrect",
    });
    return;
  }

  const session = await user_session_handler.createSession(found_user.user_id);

  res.cookie("session_id", session.session_id, {
    httpOnly: true,
    expires: session.timeout_date,
  });

  res
    .status(constants.HTTP_STATUS_OK)
    .json({ message: "User logged in successfully" });
}
