import express from "express";
import * as FeedBackController from "../controllers/feedback.controller";

const router = express.Router({ mergeParams: true });

router.post("/", FeedBackController.sendFeedback);
router.get("/", FeedBackController.getFeedbacks);

export default { prefix: "order", router };
