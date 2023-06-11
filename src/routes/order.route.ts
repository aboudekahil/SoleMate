import express from "express";
import * as OrderController from "../controllers/order.controller";
import { makePostEndpoint } from "../middlewares/validate.middleware";
import { order_place_schema } from "../schemas/order.schema";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  makePostEndpoint(order_place_schema, OrderController.placeOrder)
);

export default { prefix: "order", router };
