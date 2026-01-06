import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  cancelPayment,
  refundPayment,
  getPayments,
  getSinglePayment,
} from "../controllers/paymentcontroller.js";

const router = express.Router();

router.post("/payment", createPaymentIntent);
router.post("/payment/confirm", confirmPayment);

router.get("/payment", getPayments);
router.get("/payment/:id", getSinglePayment);

router.post("/payment/cancel", cancelPayment);
router.post("/payment/refund", refundPayment);

export default router;
