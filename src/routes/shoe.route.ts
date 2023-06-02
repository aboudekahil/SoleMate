import express from "express";
import * as ShoeController from "../controllers/shoe.controller";
import { upload } from "../config/multer.config";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  ShoeController.multerErrorHandlerMiddleware(
    upload.fields([
      { name: "front", maxCount: 1 },
      { name: "back", maxCount: 1 },
      { name: "sides1", maxCount: 1 },
      { name: "sides2", maxCount: 1 },
      { name: "tag", maxCount: 1 },
      { name: "insole", maxCount: 1 },
      { name: "box_front", maxCount: 1 },
      { name: "box_tag", maxCount: 1 },
      { name: "box_date", maxCount: 1 },
      { name: "other", maxCount: 4 },
    ])
  ),
  ShoeController.addShoe
);

router.get("/", ShoeController.getShoes);

export default { prefix: "shoe", router };
