"use client";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Your Stripe publishable key (test key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function StripeWrapper({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
