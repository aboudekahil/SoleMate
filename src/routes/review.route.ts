import express from "express";
import * as ReviewController from "../controllers/review.controller";
import { makePostEndpoint } from "../middlewares/validate.middleware";
import { review_create_schema } from "../schemas/review.schema";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  makePostEndpoint(review_create_schema, ReviewController.sendReview)
);
router.get("/", ReviewController.getReviews);

export default { prefix: "order", router };
