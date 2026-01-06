import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
    },

    stripeRefundId: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "usd",
    },

    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    cardHolderName: String,
    email: String,
    cardBrand: String,
    last4: String,
    refundedAt: Date,
    cancelledAt: Date,
    
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
