import express from "express";
import * as OrderController from "../controllers/order.controller";

const router = express.Router({ mergeParams: true });

router.post("/", OrderController.placeOrder);

export default { prefix: "order", router };
