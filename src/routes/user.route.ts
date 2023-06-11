import express from "express";
import * as UserController from "../controllers/user.controller";
import { makePostEndpoint } from "../middlewares/validate.middleware";
import { user_login_schema, user_signup_schema } from "../schemas/user.schema";

const router = express.Router({ mergeParams: true });

router.post(
  "/signup",
  makePostEndpoint(user_signup_schema, UserController.signup)
);
router.post(
  "/login",
  makePostEndpoint(user_login_schema, UserController.login)
);
router.post("/logout", UserController.logout);

export default { prefix: "user", router };
