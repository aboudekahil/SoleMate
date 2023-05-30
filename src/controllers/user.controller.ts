import { Request, Response } from "express";
import UserService from "../services/userService";
import { InvalidError } from "../errors/InvalidError";
import { user_session_handler } from "../config/session.config";

export const signup = async (req: Request, res: Response) => {
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
    });

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof InvalidError)
      res.status(403).json(JSON.parse(error.toString()));
    else res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const user_service = new UserService();

  const found_user = await user_service.findUserByEmailAndPassword(
    req.body.email_address,
    req.body.password
  );

  if (!found_user) {
    res.status(403).json(
      JSON.parse(
        new InvalidError([
          {
            title: "Invalid credentials",
            message: "Email or password is incorrect",
          },
        ]).toString()
      )
    );
    return;
  }

  const session = await user_session_handler.createSession(found_user.user_id);

  res.cookie("session_id", session.session_id, {
    httpOnly: true,
    expires: session.timeout_date,
  });

  res.status(200).json({ message: "User logged in successfully" });
};
