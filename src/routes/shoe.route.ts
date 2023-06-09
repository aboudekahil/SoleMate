import express from "express";
import * as ShoeController from "../controllers/shoe.controller";
import { upload } from "../configs/multer.config";
import { multerFileChecker } from "../middlewares/files.middleware";
import { makePostEndpoint } from "../middlewares/validate.middleware";
import { shoe_create_schema } from "../schemas/shoe.schema";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  multerFileChecker(
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
      {
        name: "other",
        maxCount: parseInt(process.env.MAX_OTHER_PHOTOS || "5"),
      },
    ])
  ),
  makePostEndpoint(shoe_create_schema, ShoeController.addShoe)
);

router.get("/", ShoeController.getShoes);
router.get("/:id", ShoeController.getShoe);

export default { prefix: "shoe", router };
