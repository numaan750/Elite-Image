import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import Payment from "../models/payment.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSinglePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
    
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId, email, cardHolder } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    // DB me pending payment save
    await Payment.create({
      userId,
      email,
      cardHolderName: cardHolder, // NEW
      stripePaymentIntentId: paymentIntent.id,
      amount,
      status: "pending",
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      {
        status: "succeeded",
        cardBrand:
          paymentIntent.charges.data[0].payment_method_details.card.brand,
        last4: paymentIntent.charges.data[0].payment_method_details.card.last4,
        cardHolderName: paymentIntent.charges.data[0].billing_details.name,
        email: paymentIntent.charges.data[0].billing_details.email,
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!payment || payment.status !== "pending") {
      return res.status(400).json({ message: "Payment cannot be cancelled" });
    }

    await stripe.paymentIntents.cancel(paymentIntentId);

    payment.status = "cancelled";
    payment.cancelledAt = new Date();
    await payment.save();

    res.status(200).json({ success: true, message: "Payment cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!payment || payment.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not refundable" });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    payment.status = "refunded";
    payment.stripeRefundId = refund.id;
    payment.refundedAt = new Date();
    await payment.save();

    res.status(200).json({ success: true, refund });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
