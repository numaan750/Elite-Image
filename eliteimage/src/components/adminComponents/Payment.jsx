"use client";
import React, { useState, useContext } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AppContext);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [cardKey, setCardKey] = useState(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!cardHolder) {
      toast.error("Please enter card holder name");
      return;
    }

    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          userId: user._id,
          email: user.email,
          cardHolder: cardHolder,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Payment failed");
      }

      const data = await res.json();
      const clientSecret = data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      const confirmRes = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardHolder,
            email: user.email,
          },
        },
      });

      if (confirmRes.error) {
        toast.error(confirmRes.error.message);
        setLoading(false);
        return;
      }

      if (confirmRes.paymentIntent.status === "succeeded") {
        await fetch(`${API_URL}/api/payment/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: confirmRes.paymentIntent.id,
          }),
        });

        toast.success("Payment Successful! 🎉");
        setCardHolder("");
        setAmount(0);
        setCardKey(Date.now());

        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Payment Error:", err);
      toast.error(err.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-start bg-white pt-10 sm:pt-10 lg:pt-10">
      <div className="w-full max-w-xl">
        <h3 className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium mb-6 sm:mb-6">
          Eliteimage Ai
        </h3>
        <h2 className="text-[18px] sm:text-[20px] lg:text-[28px] font-semibold mb-6 sm:mb-10 lg:mb-12">
          Final step, complete your payment
        </h2>

        <form
          className="space-y-4 sm:space-y-5 lg:space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-[16px] sm:text-[20px] font-medium mb-1 sm:mb-2">
              Card Holder
            </label>
            <input
              type="text"
              placeholder="Augustine Campbell"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full rounded-md border border-[#034F75] bg-[#D3E7F0] px-3 sm:px-4 py-2 text-[14px] sm:text-[18.76px] focus:outline-none focus:ring-2 focus:ring-[#034F75]"
            />
          </div>
          <div>
            <label className="block text-[16px] sm:text-[20px] font-medium mb-1 sm:mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              value={amount === 0 ? "" : amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full rounded-md border border-[#034F75] bg-[#D3E7F0] px-3 sm:px-4 py-2 text-[14px] sm:text-[18.76px] focus:outline-none focus:ring-2 focus:ring-[#034F75]"
            />
          </div>

          <div>
            <label className="block text-[16px] sm:text-[20px] font-medium mb-1 sm:mb-2">
              Card Details
            </label>
            <div className="border border-[#034F75] bg-[#D3E7F0] rounded-md p-3 sm:p-4">
              <CardElement
                key={cardKey}
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#000",
                      "::placeholder": {
                        color: "#666",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 sm:mt-6 w-full sm:w-auto rounded-md bg-[#034F75] px-8 sm:px-12 lg:px-14 py-2 sm:py-2.5 text-[#D3E7F0] font-medium text-[16px] sm:text-[18px] hover:bg-[#023a56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
