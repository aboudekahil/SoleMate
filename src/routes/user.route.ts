import express from "express";

export const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/");
