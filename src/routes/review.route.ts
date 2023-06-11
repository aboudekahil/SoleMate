import express from "express";
import * as ReviewController from "../controllers/review.controller";

const router = express.Router({ mergeParams: true });

router.post("/", ReviewController.sendReview);
router.get("/", ReviewController.getReviews);

export default { prefix: "order", router };
