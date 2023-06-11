import express from "express";
import * as FeedBackController from "../controllers/feedback.controller";
import { makePostEndpoint } from "../middlewares/validate.middleware";
import { send_feedback_schema } from "../schemas/feedback.schema";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  makePostEndpoint(send_feedback_schema, FeedBackController.sendFeedback)
);
router.get("/", FeedBackController.getFeedbacks);

export default { prefix: "order", router };
