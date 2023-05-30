import express from "express";
import * as ShoeController from "../controllers/shoe.controller";

const router = express.Router({ mergeParams: true });

router.post("/", ShoeController.addShoe);

export default { prefix: "shoe", router };
