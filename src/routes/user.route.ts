import express from "express";
import * as UserController from "../controllers/user.controller";

const router = express.Router({ mergeParams: true });

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

export default { prefix: "user", router };
