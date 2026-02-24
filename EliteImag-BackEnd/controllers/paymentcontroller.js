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

// YE PURI confirmPayment function REPLACE karo:

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, creditsToAdd, userId } = req.body; // ADD creditsToAdd, userId

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["latest_charge"], // ADD THIS - charges expand karo
      },
    );

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const charge = paymentIntent.latest_charge; // CHANGE - charges.data[0] ki jagah

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      {
        status: "succeeded",
        cardBrand: charge?.payment_method_details?.card?.brand || "",
        last4: charge?.payment_method_details?.card?.last4 || "",
        cardHolderName: charge?.billing_details?.name || "",
        email: charge?.billing_details?.email || "",
      },
    );

    // Credits add karo agar userId aur creditsToAdd mile
    if (userId && creditsToAdd && creditsToAdd > 0) {
      const loginUserSchema = (await import("../models/loginUser.js")).default;
      const user = await loginUserSchema.findById(userId);
      if (user) {
        user.credits = (Number(user.credits) || 0) + Number(creditsToAdd);
        await user.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("confirmPayment error:", error); // ADD logging
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
